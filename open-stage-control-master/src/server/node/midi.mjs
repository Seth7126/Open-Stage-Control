import {PythonShell} from 'python-shell'
import fs from 'fs'
import path from 'path'
import {EventEmitter} from 'events'
import * as settings from './settings.mjs'


var scriptPath = __dirname.includes('server/node') ?
    path.resolve(__dirname, '../python') :  // src folder structure
    path.resolve(__dirname, './python')     // app folder structure with rollup chunking

var midiBinaries = {
    x64: {
        linux: 'osc-midi-linux',
        darwin: 'osc-midi-osx',
        win32: 'osc-midi-windows.exe'
    },
    arm64:{
        darwin: 'osc-midi-osx',
    }
}

var expectMidiBinaries = fs.existsSync(path.resolve(scriptPath, './.expect-midi-bin')),
    expectMidiBinariesError = false

var pythonPathOverride
if (midiBinaries[process.arch] && midiBinaries[process.arch][process.platform]) {
    var p = path.resolve(scriptPath, midiBinaries[process.arch][process.platform])
    if (fs.existsSync(p)) {
        pythonPathOverride = p
    } else if (expectMidiBinaries) {
        expectMidiBinariesError = true
    }
}

class MidiConverter extends EventEmitter{

    constructor() {

        super()

        if (expectMidiBinariesError) MidiConverter.midiBinariesError()

        this.running = false
        this.restarting = false
        this.py = {}

        this.start()


        process.on('message', (m) => {
            if (m == 'midiRestart') {
                this.restart()
            }
        })

    }

    start() {

        if (this.running) return

        this.py = new PythonShell('midi.py', Object.assign({
            args: [
                '--params',
                settings.read('debug') ? 'debug' : '',
                ...settings.read('midi')
            ],
            pythonPath: MidiConverter.getPythonPath()
        }, {scriptPath, mode:'text'}))

        this.py.childProcess.on('error', (e)=>{
            if (e.code === 'ENOENT') {
                console.error(`(ERROR, MIDI) Could not find python binary: ${e.message.replace(/spawn (.*) ENOENT/, '$1')}`)
            } else {
                console.error(`(ERROR, MIDI) ${e.message}`)
            }
        })

        this.py.childProcess.on('exit', (code)=>{
            if (code === null && !this.restarting) console.error('(ERROR, MIDI) Midi bridge process crashed')
            this.running = false
            this.emit('stopped')
        })

        this.running = true

    }

    stop() {

        if (this.running) this.py.childProcess.kill()

    }

    restart() {

        if (this.running) {
            this.restarting = true
            this.once('stopped', ()=>{
                this.start()
                this.restarting = false
            })
            this.stop()
        }
    }

    send(data) {

        if (!this.running) return

        var args = []
        for (let i in data.args) {
            args.push(data.args[i].value)
        }

        this.py.send(JSON.stringify([data.port, data.address, ...args]))

    }



    init(receiveOsc) {

        this.receiveOsc = receiveOsc
        this.py.on('message', (message)=>{
            MidiConverter.parseIpc(message, this)
        })

    }

    static parseIpc(message, instance) {

        // console.log(message)
        var name, data
        try {
            [name, data] = JSON.parse(message)
        } catch (err) {
            if (settings.read('debug')) console.error(`(ERROR, MIDI) Unparsed python log:\n    ${message}`)
        }
        if (name == 'log') {
            if (data.indexOf('ERROR') > -1) {
                console.error(data)
            } else {
                console.log(data)
            }
        } else if (name == 'debug') {
            if (data.indexOf('in:') === 0) {
                console.log('\x1b[36m(DEBUG, MIDI)', data, '\x1b[0m')
            } else if (data.indexOf('out:') === 0) {
                console.log('\x1b[35m(DEBUG, MIDI)', data, '\x1b[0m')
            } else {
                console.log('(DEBUG, MIDI) ' + data)
            }
        } else if (name ==  'osc') {
            instance.receiveOsc(data)
        } else if (name == 'error') {
            console.error('(ERROR, MIDI) ' + data)
        }

    }

    static list() {

        if (expectMidiBinariesError) MidiConverter.midiBinariesError()

        PythonShell.run('midi.py', Object.assign({pythonPath: MidiConverter.getPythonPath(), args: ['--params', 'list-only']}, {scriptPath, mode:'text'}), function(e, results) {
            if (e) {
                if (e.code === 'ENOENT') {
                    console.error(`(ERROR, MIDI) Could not find python binary: ${e.message.replace(/spawn (.*) ENOENT/, '$1')}`)
                } else {
                    console.error(`(ERROR, MIDI) ${e.message}`)
                }
            }

            for (let r of results) {
                MidiConverter.parseIpc(r)
            }
        })

    }

    static getPythonPath() {

        var pythonPath = settings.read('midi') ? settings.read('midi').filter(x=>x.includes('path=')).map(x=>x.split('=')[1])[0] : undefined

        if (!pythonPath && pythonPathOverride) pythonPath = pythonPathOverride

        return pythonPath

    }

    static midiBinariesError() {

        console.error(`(ERROR, MIDI) Could not find midi binary file ${p}\nIt may have been deleted by your antivirus.`)
        console.log('(INFO, MIDI) Falling back to python implementation (see https://openstagecontrol.ammd.net/docs/midi/midi-configuration/).')
        expectMidiBinariesError = false

    }

}

export default MidiConverter
