import html from 'nanohtml'
import semver from 'semver'
import {ipcRenderer} from 'electron'
import terminal from './terminal.mjs'
import settings from './settings.mjs'
import './toolbar.mjs'
import {DOM, PACKAGE} from '../client/globals.mjs'

DOM.get(document, '#osc-greeting-header')[0].appendChild(html`${PACKAGE.productName} <span class="version">v${PACKAGE.version}</span>`)

if (settings.remote.read('checkForUpdates') && navigator.onLine) {

    var request = new XMLHttpRequest()
    request.open('GET', 'https://framagit.org/api/v4/projects/jean-emmanuel%2Fopen-stage-control/releases', true)

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {

            var data = JSON.parse(request.responseText).filter(x=>!x.name.match(/alpha|beta/)),
                current = 'v' + PACKAGE.version,
                latest = data[0].name

            if (semver.gt(latest, current)) {
                terminal.log(`(INFO) A new version is available : <a target="_blank" href="https://openstagecontrol.ammd.net/download/">${latest}</a>`, 'info')
            } else if (semver.gt(current, latest)) {
                terminal.log(`(WARNING) Using development version ${current}`, 'warning')
            }

        }
    }

    request.send()

}

if (settings.remote.read('alwaysOnTop')) {

    settings.remote.getCurrentWindow().setAlwaysOnTop(true)

}


if (settings.remote.read('autoStart')) {

    ipcRenderer.send('start')

}
