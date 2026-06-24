# Fragments

Fragments allow breaking sessions into multiple files and reusable components made of multiple widgets.

## Fragment files


When right-clicking on a widget in the editor mode, it is possible to export it as a fragment file.

Fragment files have the same extension as session files (`.json`) and can be opened like regular sessions. When doing so, keep in mind that only the first child of the root widget will be saved. It is possible to save a fragment file as a session file (and vice versa) by toggling the `Fragment mode` in the main menu.


## Fragment widgets

Fragment widgets work like clone widget except their source widget are loaded from fragment files or session files. When the sources files are modified, the fragment widgets are updated automatically.
