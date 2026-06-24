## Lite headless mode

It's possible to run the server in headless mode with the nodejs engine embedded in Electron, this reduces memory / cpu usage significantly.

```
ELECTRON_RUN_AS_NODE=1 open-stage-control path/to/open-stage-control/resources/app/ [options]
```


## Running with node

If Electron does not run on your platform, it is possible to run the server in headless mode using [Node.js](https://nodejs.org/en/download/package-manager/).


1. Install [Node.js](https://nodejs.org/en/download/package-manager/)
2. Download `open-stage-control-[version]-node.zip` package and extract it
3. Run `node /path/to/open-stage-control [options]`


!!! info
    When running from sources or with regular binaries (packaged with electron), the command slightly differs:

    - electron package: `node /path/to/open-stage-control/resources/app [options]`
    - from sources: `node /path/to/open-stage-control/app [options]`
