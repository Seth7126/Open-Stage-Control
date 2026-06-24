Client options can be set either with the server's `--client-options` option, or per client by adding query parameters to the server's url. One must prepend the url with a question mark (`?`) followed by `parameter=value` pairs separated with ampersands (`&`).


| Option | Value | Default | Description |
|----|----|----|----|
| hdpi | 1 / 0 | 0 | enable high resolution canvas |
| forceHdpi | number | 0 | force canvas scaling (ignore `hdpi`) |
| doubleTap | number | 375 | sets the double tap/click time threshold in milliseconds |
| zoom | number | 1 | sets the initial zoom |
| framerate | number | 60 | limit canvas drawing framerate |
| desyncCanvas | number | 0 | set to 1 to enable desynchronized canvas (may improve rendering performances) |
| lang | string | *system_default* | use a different language than the default if available (available languages: en, fr, de, pl) |
| consoleLength | number | 300 | sets the maximum number of log messages in the client's console |
| id | string | *random_id* | client's unique id (use with caution: two clients should never have the same id) |
| usePercents | 1 / 0 | 0 | sets the editor's "relative units" option  |
| noFocus | 1 / 0 | 0 | (built-in client only) prevent the client window from taking focus |
| clientSync | 1 / 0 | 1 | set to 0 to prevent the client from syncing with other clients |
| altTraversing | 1 / 0 | 0 | set to 1 to enable an alternative traversing behavior for toggle buttons (traversing gestures on toggle buttons will change their values in only one way depending on the first touched button's state) |
| virtualKeyboard | 1 / 0 | 0 | (desktop only) set to 1 to enable the virtual keyboard by default |
| notifications | 1 / 0 | 1 | set to 0 to hide notifications by default |
| title | string | '' | replace window title |
| noWarning | 1 / 0 | 0 | set to 0 to disable unsaved session warnings |

Example:

`http://server-ip:port?hdpi=1`
