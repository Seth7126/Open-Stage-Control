The **server** can be configured with many options, either from a terminal or with the help of the **launcher**.

## Options

!!! quote ""
    #### `send`

    Defines the default osc/midi targets. These will be added to the widget's individual targets. Targets must be separated by a space and formatted as follows:

    - `ip_address:port`
    - `host_name:port`
    - `midi:device_name`

!!! quote ""
    #### `load`

    Path to a session file (.json). All clients connecting the server will load it.

!!! quote ""
    #### `state`

    Path to a state file (.state). All clients connecting the server will load it.


!!! quote ""
    #### `custom-module`

    Path to a custom module file (.js).

    **WARNING:** custom module can access the file system, use at your own risk.


!!! quote ""
    #### `port`

    HTTP port for the server (default: `8080`).


!!! quote ""
    #### `osc-port`

    OSC (UDP) input port (default: `port`).


!!! quote ""
    #### `tcp-port`

    OSC (TCP) input port.


!!! quote ""
    #### `tcp-targets`

    TCP servers to connect to. When sending osc messages, if the target matches one of these, TCP protocol will be used instead of UDP.  Targets must be separated by a space and formatted as follows:

    - `ip_address:port`
    - `host_name:port`


!!! quote ""
    #### `midi`

    MIDI options separated by spaces, MIDI support must be enabled, see [MIDI configuration](../midi/midi-configuration.md).


!!! quote ""
    #### `debug`

    Print sent and received messages in the console. This may impact performance and should not be enabled in production.



!!! quote ""
    #### `no-gui`

    Disable built-in client window.


!!! quote ""
    #### `fullscreen`

    Start the built-in client window in fullscreen.


!!! quote ""
    #### `theme`

    Theme names or paths. See [Themes](../customization/themes.md).


!!! quote ""
    #### `client-options`

    Default [client options](../client-options.md), separated by spaces.


!!! quote ""
    #### `disable-vsync`

    Disable built-in client window's vertical synchronization.


!!! quote ""
    #### `force-gpu`

    Disable built-in client window's gpu blacklist (may improve rendering performance in some cases).


!!! quote ""
    #### `read-only`

    Disable session editing, and file saving.


!!! quote ""
    #### `remote-saving`

    Disable file saving for hosts that don't match the regular expression.

    Sessions are saved and opened on the server's filesystem. It is possible to limit this feature to specific client with a regular expression. For example, `"127.0.0.1|192.168.0.10"` disables remote saving except for clients with ip addresses `127.0.0.1` (the server's local address) and `192.168.0.10`.


!!! quote ""
    #### `remote-root`

    Set file browsing root folder. Prevent writing files outside of this folder.

!!! quote ""
    #### `authentication`

    Restrict access to `user:password` (remote clients will be prompted for these credentials).

!!! quote ""
    #### `instance-name`

    Server's name on zeroconf/bonjour network. Incremented automatically if not available.

!!! quote ""
    #### `use-ssl`

    Use HTTPS protocol instead of HTTP (a self-signed certificate will be created)



## Command-line options

The following options can only be set from a terminal.

!!! quote ""
    #### `disable-gpu`

    Disable hardware acceleration for the launcher window and the built-in client window.


!!! quote ""
    #### `inspect`

    Enable node inspector.


!!! quote ""
    #### `cache-dir`

    Override default cache directory (contains browser cache and localStorage data).


!!! quote ""
    #### `config-file`

    Override default config file location (contains session history and launcher config). Defaults to `cache-dir/config.json`.



!!! quote ""
    #### `client-position`

    Define the built-in client window position, must be a pair of integers separated by a comma (`x,y`).



!!! quote ""
    #### `client-size`

    Define the built-in client window size, must be a pair of integers separated by a comma (`width,height`).

!!! quote ""
    #### `no-qrcode`

    Disable qrcode when the server starts.


!!! quote ""
    #### `help`

    Show help.

!!! quote ""
    #### `docs`

    Serve documentation website locally and open it with the system's default browser


!!! quote ""
    #### `version`

    Show version number.


## Running in a terminal

Options name must be prepended with a double dash (`--`) in a terminal.

!!! example "Example"
    ```
    open-stage-control --no-gui --load path/to/your/session.json --theme path/to/your/theme.css
    ```

    Launches the server in headless mode, and makes all clients load provided session and theme automatically.


## Running in a terminal on Windows

Windows users launching the app from a terminal need to add a double dash (`--`) and a space before their options:

```bash
open-stage-control.exe -- --port 5555 [...]

# when running from sources
npm start -- -- [options]
```
