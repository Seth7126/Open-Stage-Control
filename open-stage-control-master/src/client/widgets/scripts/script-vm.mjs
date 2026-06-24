import widgetManager from '../../managers/widgets.mjs'
import stateManager from '../../managers/state.mjs'
import cache from '../../managers/cache.mjs'
import {deepCopy} from '../../utils.mjs'
import {urlParser} from '../utils.mjs'
import Vm from '../vm.mjs'
import ipc from '../../ipc/index.mjs'
import uiFilebrowser from '../../ui/ui-filebrowser.mjs'
import uiFileUpload from '../../ui/ui-fileupload.mjs'
import {setFOCUSABLE} from '../../globals.mjs'

var toolbar
setTimeout(async()=>{
    // use setTimeout to fix init order in safari...
    toolbar = (await import('../../ui/main-menu.mjs')).default
})

class ScriptVm extends Vm {

    constructor() {

        super()

        this.valueOptions = []

    }

    getValueOptions() {

        return this.valueOptions[this.valueOptions.length - 1] || {send: true, sync: true}

    }

    setValueOptions(options) {

        if (!options) this.valueOptions.pop()
        else this.valueOptions.push(options)

    }

    resolveId(id) {

        var widget = this.getWidget()

        if (id === 'this') return [widget]
        else if (id === 'parent' && widget.parent !== widgetManager) return [widget.parent]
        else return widgetManager.getWidgetById(id)

    }

    checkContext(name) {
        if (this.widget.length === 0) throw name + '() cannot be called from outside the script property'
    }

    registerGlobals() {

        this.globals.set = (id, value, extraOptions = {send: true, sync: true})=>{

            this.checkContext('set')

            var widget = this.getWidget()
            var options = {},
                valueOptions = this.getValueOptions()

            for (var k in valueOptions) {
                if (k === 'widget') options[k] = valueOptions[k]
                else options[k] = deepCopy(valueOptions[k])
            }

            options.fromScript = widget.hash

            if (options.dragged) options.dragged = false
            if (options.local) options.local = false

            // if (id === options.id) options.sync = false // loop stop
            // if (this.getWidget() === options.widget) options.sync = false // loop stop

            if (extraOptions.send === false) options.send = false
            if (extraOptions.sync === false) options.sync = false
            if (extraOptions.script === false) options.script = false
            if (extraOptions.external === true) {
                options.fromExternal = true
                options.send = false
            }

            var widgets
            if (id.includes('*')) {
                widgets = this.resolveId(
                    Object.keys(widgetManager.idRoute).filter(key => key.match(new RegExp('^' + id.replace(/\*/g, '.*') + '$')))
                ).filter(w => w !== widget)
            } else {
                widgets = this.resolveId(id).slice(0, 1)
            }


            for (var i = widgets.length - 1; i >= 0; i--) {

                widgets[i].setValue(value, options)

            }

        }

        this.globals.setVar = (id, name, value)=>{

            this.checkContext('setVar')

            var widgets
            if (id.includes('*')) {
                var widget = this.getWidget()
                widgets = this.resolveId(
                    Object.keys(widgetManager.idRoute).filter(key => key.match(new RegExp('^' + id.replace(/\*/g, '.*') + '$')))
                ).filter(w => w !== widget)
            } else {
                widgets = this.resolveId(id)
            }


            for (var i = widgets.length - 1; i >= 0; i--) {


                if (widgets[i].variables[name]) {

                    widgets[i].variables[name].value = value
                    widgets[i].variables[name].updated = 1
                    widgets[i].updateProps(widgets[i].variables[name].propNames)
                    widgets[i].variables[name].updated = 0

                } else {

                    widgets[i].variables[name] = {value: value, propNames: []}

                }

            }

        }

        this.globals.send = (target, address, ...args)=>{

            this.checkContext('send')

            var options = this.getValueOptions()

            if (!options.send) return

            if (target && target[0] === '/') {
                args.unshift(address)
                address = target
                target = null
            }

            var overrides = {
                address,
                v: args,
                preArgs: []
            }

            if (target) overrides.target = Array.isArray(target) ? target : [target]

            var widget = this.getWidget()

            widget.sendValue(overrides, {force: true})

        }

        this.globals.get = (id)=>{

            this.checkContext('get')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].getValue) {

                    var v = widgets[i].getValue()
                    if (v !== undefined) return v

                }

            }

        }

        this.globals.getVar = (id, name)=>{

            this.checkContext('getVar')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].variables[name]) return deepCopy(widgets[i].variables[name].value)

            }

        }

        this.globals.getProp = (id, prop)=>{

            this.checkContext('getProp')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                var v = widgets[i].getProp(prop)
                if (v !== undefined) return deepCopy(v)

            }

        }

        this.globals.updateProp = (id, prop)=>{

            this.checkContext('updateProp')

            var widgets = this.resolveId(id),
                widget = this.getWidget()

            for (var i = widgets.length - 1; i >= 0; i--) {

                widgets[i].updateProps(Array.isArray(prop) ? prop : [prop], widget)

            }

        }

        this.globals.updateCanvas = (id)=>{

            this.checkContext('updateCanvas')

            var widgets = this.resolveId(id)
            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].batchDraw) widgets[i].batchDraw()

            }

        }

        this.globals.getIndex = (id = 'this')=>{

            this.checkContext('getIndex')

            var widget = this.resolveId(id).pop()
            if (widget) return widget.parent.children.indexOf(widget)

        }

        this.globals.getScroll = (id)=>{

            this.checkContext('getScroll')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].getProp('scroll')) return widgets[i].getScroll()

            }

            return []

        }

        this.globals.setScroll = (id, x, y)=>{

            this.checkContext('setScroll')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].getProp('scroll')) widgets[i].setScroll(x, y, true, false)

            }

        }

        this.globals.scrollIntoView = (id, options)=>{

            this.checkContext('setScroll')

            var widgets = this.resolveId(id)

            for (var i = widgets.length - 1; i >= 0; i--) {

                if (widgets[i].container && widgets[i].isVisible()) {
                    widgets[i].container.scrollIntoView(options)
                }

            }

        }



        this.globals.httpGet = (url, callback)=>{

            this.checkContext('httpGet')

            var parser = urlParser(url),
                err = (e)=>{console.error(e)}

            if (!parser.isLocal()) return err('httpGet error (' + url + '): non-local url')

            var xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.onload = (e)=>{
                if (xhr.readyState === 4 && xhr.status === 200 && callback) {
                    callback(xhr.responseText)
                }
            }
            xhr.onerror = (e)=>err(`httpGet error (${url}): ${xhr.status} ${xhr.statusText}`)
            xhr.send(null)

        }

        this.globals.stateGet = (filter)=>{

            this.checkContext('stateGet')

            if (filter) {

                filter = Array.isArray(filter) ? filter : [filter]

                var containers = filter.map(x=>this.resolveId(x)).reduce((a,b)=>a.concat(b), [])

                if (!containers.length) return
                filter = (widget)=>{
                    return containers.some(x=>x.contains(widget) || x === widget)
                }
            }

            return deepCopy(stateManager.get(filter))

        }

        this.globals.stateSet = (state, extraOptions = {})=>{

            this.checkContext('stateSet')

            var options = this.getValueOptions()
            stateManager.set(state, extraOptions.send === false ? false : options.send)

        }


        this.globals.storage = {

            setItem: (k, v)=>{
                this.checkContext('storage.setItem')
                cache.set('script.' + k, v)
            },
            getItem: (k)=>{
                this.checkContext('storage.getItem')
                return cache.get('script.' + k)
            },
            removeItem: (k)=>{
                this.checkContext('storage.removeItem')
                cache.remove('script.' + k)
            },
            clear: ()=>{
                this.checkContext('storage.clear')
                cache.clear('script.')
            }

        }

        this.globals.setTimeout = (id, callback, timeout)=>{

            this.checkContext('setTimeout')

            if (typeof id === 'function') {
                timeout = callback
                callback = id
                id = undefined
            }

            var widget = this.getWidget(),
                options = this.getValueOptions()


            if (widget.timeouts[id] !== undefined) {
                clearTimeout(widget.timeouts[id])
                delete widget.timeouts[id]
            }
            widget.timeouts[id] = setTimeout(()=>{
                this.setWidget(widget)
                this.setValueOptions(options)
                try {
                    callback()
                } catch(e) {
                    widget.errorProp('script', 'setTimeout', e)
                }
                this.setWidget()
                this.setValueOptions()
            }, timeout)

            return id

        }

        this.globals.clearTimeout = (id)=>{

            this.checkContext('clearTimeout')

            var widget = this.getWidget()

            clearTimeout(widget.timeouts[id])
            delete widget.timeouts[id]

        }

        this.globals.setInterval = (id, callback, timeout)=>{

            this.checkContext('setInterval')

            if (typeof id === 'function') {
                timeout = callback
                callback = id
                id = undefined
            }

            var widget = this.getWidget(),
                options = this.getValueOptions()


            if (widget.intervals[id] !== undefined) clearTimeout(widget.intervals[id])
            delete widget.intervals[id]

            widget.intervals[id] = setInterval(()=>{
                this.setWidget(widget)
                this.setValueOptions(options)
                try {
                    callback()
                } catch(e) {
                    widget.errorProp('script', 'setInterval', e)
                }
                this.setWidget()
                this.setValueOptions()
            }, timeout)

            return id

        }

        this.globals.clearInterval = (id)=>{

            this.checkContext('clearInterval')

            var widget = this.getWidget()

            clearInterval(widget.intervals[id])
            delete widget.intervals[id]

        }


        this.globals.setFocus = (id)=>{

            this.checkContext('setFocus')

            if (id) {
                var widgets = this.resolveId(id)

                if (widgets.length) {
                    if (widgets[0].focus) widgets[0].focus()
                }
            } else if (document.activeElement) {
                document.activeElement.blur()
            }

            // built-in client only: electron will call window.focus()
            console.debug('ELECTRON.FOCUS()')

        }

        this.globals.unfocus = ()=>{

            this.checkContext('unfocus')

            window.blur()
            // built-in client only: electron will call window.blur()
            console.debug('ELECTRON.BLUR()')

        }

        this.globals.setFocusable = (focusable)=>{

            this.checkContext('setFocusable')
            setFOCUSABLE(!!focusable)
            console.debug('ELECTRON.SETFOCUSABLE('+(focusable ? 1 : 0)+')')

        }


        function getToolbarActionById(id, entries) {
            for (var a of entries) {
                if (a.id == id) {
                    return a
                }
                if (Array.isArray(a.action)) {
                    var ret = getToolbarActionById(id, a.action)
                    if (ret) return ret
                }
            }
        }

        this.globals.toolbar = (...args)=>{

            this.checkContext('toolbar')

            var options = this.getValueOptions()

            if (!options.send) return

            var action = toolbar.entries.filter(x=>!x.separator)

            if (typeof args[0] == 'string') {

                action = getToolbarActionById(args[0], action)
                if (action) action = action.action // get callback
                if (action && typeof action.class == 'function') {
                    if (action.class().match(/disabled/)) action = null
                }

            } else {

                for (var i of args) {
                    if (action[i]) action = action[i].action
                    if (!Array.isArray(action)) break
                    action = action.filter(x=>!x.separator)
                }

            }

            if (typeof action === 'function') action()

        }

        this.globals.getToolbar = (id)=>{

            this.checkContext('toolbar')

            var options = this.getValueOptions()

            if (!options.send) return

            var action = getToolbarActionById(id, toolbar.entries.filter(x=>!x.separator))

            if (action && typeof action.class == 'function') return action.class().split(' ').includes('on')

        }

        this.globals.openUrl = (url)=>{

            this.checkContext('openUrl')

            var options = this.getValueOptions()

            if (options.send) window.open(url, '_blank')

        }

        this.globals.runAs = (id, callback)=>{

            this.checkContext('runAs')

            var widgets = this.resolveId(id),
                widget = this.getWidget()

            if (widgets.length) {

                this.setWidget(widgets[0])
                try {
                    callback()
                } catch(e) {
                    widget.errorProp('script', 'runAs', e)
                }
                this.setWidget()

            }

        }

        this.globals.reload = (keepState = true)=>{

            this.checkContext('reload')

            var options = this.getValueOptions(),
                widget = this.getWidget()

            if (options.onCreate) {
                widget.errorProp('onCreate', '', 'reload() cannot be called from onCreate')
            } else if (options.send){
                if (keepState) ipc.trigger('reload')
                else window.location.href = window.location.href
            }


        }

        this.globals.Image = Image

        this.globals.getNavigator = ()=>{
            this.checkContext('getNavigator')
            return navigator

        }


        this.globals.browseFile = (options, callback)=>{
            this.checkContext('browseFile')
            if (typeof options === 'function') {
                callback = options
                options = {}
            }


            if (typeof callback === 'function') {

                var widget = this.getWidget(),
                    valueOptions = this.getValueOptions()

                uiFilebrowser({
                    extension: options.extention || '*',
                    directory: options.directory || undefined,
                    loadDir: !!options.allowDir,
                    save: options.mode === 'save'
                }, (path)=>{
                    this.setWidget(widget)
                    this.setValueOptions(valueOptions)
                    try {
                        callback(path.join(path[0][0] === '/' ? '/' : '\\'))
                    } catch(e) {
                        widget.errorProp('script', 'browseFile', e)
                    }
                    this.setWidget()
                    this.setValueOptions()
                })
            } else {
                widget.errorProp('script', 'browseFile', 'callback argument must be a function')
            }
        }

        this.globals.uploadFile = (options, callback)=>{
            this.checkContext('uploadFile')
            if (typeof options === 'function') {
                callback = options
                options = {}
            }


            if (typeof callback === 'function') {

                var widget = this.getWidget(),
                    valueOptions = this.getValueOptions()

                uiFileUpload(options.types, (path, content)=>{
                    this.setWidget(widget)
                    this.setValueOptions(valueOptions)
                    try {
                        callback(content)
                    } catch(e) {
                        widget.errorProp('script', 'uploadFile', e)
                    }
                    this.setWidget()
                    this.setValueOptions()
                }, (e)=>{
                    widget.errorProp('script', 'uploadFile', e)
                })
            } else {
                widget.errorProp('script', 'browseFile', 'callback argument must be a function')
            }
        }

        super.registerGlobals()

    }

}

export default new ScriptVm()
