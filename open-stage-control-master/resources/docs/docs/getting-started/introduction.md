Welcome to Open Stage Control documentation. Along these pages you'll learn how to setup OSC on your system and everything you need to start building your own control interface.

## Overview

Open Stage Control consists of 3 modules: the server, the launcher and the client.

The **server** is the core of the software, it is responsible for sending and receiving all osc/midi messages, and act as a web server that serves the clients web application. It is written in Javascript and runs with Electron, a cross-platform framework based on Chromium. By default, the server always opens a client window when it starts but it can be run in *headless* mode, without any window.

The **launcher** provides a simple way to configure and start the server. It appears whenever the server is not launched from a terminal or without being configured.

The **client** is the web application made available by the server when it starts. Any compatible browser that connects to the server by browsing to its address will create a new client instance and be able to open and modify sessions.


## Requirements

The **server** can run on all [platforms supported by Electron](https://www.electronjs.org/docs/tutorial/support#supported-platforms). Systems that can run [Node.js](https://nodejs.org/en/) may also be able to run it in headless mode (see [Running with Node](./running-with-node.md)).

The **client** is compatible with the following browsers:

- Firefox: version `75` and higher
- Chromium / Chrome: version `75` and higher

iOS devices must be of version `11` or higher.


## Installation

=== "Linux 64bit"

    **Ubuntu / Debian**

    - [Download](/download) `open-stage-control-VERSION-amd64.deb`
    - Install it by running this as root in a terminal:
    ```bash
    dpkg -i path/to/open-stage-control-VERSION-ARCH.deb
    ```

    **Other linux distributions**

    - [Download](/download) `open-stage-control-VERSION-linux-x64.zip`
    - Extract it in the location of your choice
    - The file inside it named `open-stage-control` is the app's main executable

=== "Mac 64bit"

    - [Download](/download) `open-stage-control-VERSION-osx-x64.zip`
    - Extract it in the location of your choice
    - Drag `open-stage-control.app` in your `Application` folder


=== "Mac Silicon (arm)"

    - [Download](/download) `open-stage-control-VERSION-osx-arm.zip`
    - Extract it in the location of your choice
    - Drag `open-stage-control.app` in your `Application` folder

    See [https://disable-gatekeeper.github.io/](https://disable-gatekeeper.github.io/) to workaround the "damaged and can't be opened" error.

=== "Windows 64bit"

    - [Download](/download) `open-stage-control-VERSION-win32-x64.zip`
    - Extract it in the location of your choice
    - The file inside it named `open-stage-control.exe` is the app's main executable

=== "Other systems"

    - Install [Node.js](https://nodejs.org/en/download/package-manager/)
    - Download `open-stage-control-VERSION-node.zip`
    - Extract it in the location of your choice
    - In a terminal, run `node /path/to/open-stage-control-VERSION-node --help`
