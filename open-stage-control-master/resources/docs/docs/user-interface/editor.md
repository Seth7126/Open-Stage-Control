## Widget selection

Clicking on a widget, on a tab label or on an item in the project tree selects the widgets for editing:

- All its editable properties are shown in the inspector panel
- The corresponding item in the project tree is highlighted
- A selection outline is drawn around the widget
- Dragging / Resizing handles are added to the widget

![](../../img/screenshots/editor.png)

To interact with a widget directly without selecting it, either use the middle mouse button or hold ++shift+win++ (++shift+cmd++ on Mac).

## Menu

Right clicking on a widget displays a menu with the following actions

- `Show in tree`: show widget in project tree (hidden when clicking in the project tree)
- `Position`:
    - `Send to back`: Send selected widget to back (first of siblings)
    - `Send farther`: Send selected widget farther
    - `Bring closer`: Bring selected widget closer
    - `Bring to front`: Bring selected widget to front (last of siblings)
- `Copy`: copy widget's data
- `Cut`: copy widget's data and delete selected widget
- `Paste`: paste copied widget in selected container
    - `Paste`: paste the widget as is
    - `ID + 1` : increments the id of the copied widget (and all its children) before pasting
    - `Clone` : create a clone widget targetting the copied widget
- `Add widget`: create a new widget in selected container
- `Add tab`: create a new tab in selected container
- `Export`: export as fragment file
- `Delete`: delete selected tab or widget


## Inspector

Selected widget's properties are displayed and can be modified in the inspector. The [properties reference](../widgets/properties-reference.md) lists the available properties for each widget type.

- Property fields are all multiline (press `shift + enter` for new line).
- Properties are written in JSON, with some flexibility brought by the [JSON5](https://github.com/json5/json5) format. For example, double quotes around object keys are not mandatory.
- Clicking on a property name spawns a help modal window
- Properties are divided into multiple categories that can be toggled with a click. ++alt+"Click"++ on a category closes the other categories before toggling selected category.

Some properties (for example `onValue`) have a special code editor with syntax highlighting and many keyboard shortcuts (available by clicking on the "Help" button). In these properties, pressing `enter` will not submit pending changes but instead insert a new line at the cursor position (as you would expect in a regular editor). To submit pending changes, press ++ctrl+enter++ (or ++cmd+enter== on Mac) or click outside the editor.

Widgets can be locked for edition by enabling their `lock` property. When locked, a widget can't be modified by the editor but it remains possible to delete it or to move it from a container to another in the project tree.

## Project tree

The project tree displays the whole widget structure of the session. Widgets can be reordered or moved to another container with drag-and-drop.

The "Filter" input allows filtering displayed widgets by their `id`. It's also possible to only display a single type of widget by typing `type:fader` for example.

Invisible widgets are displayed with a lower opacity and their name in italic. Locked widgets are displayed with a lock icon after their name.  

## Widget resizing / dragging

Selected widget can be resized using its south, south-east and east handles. It can be dragged with its north-west handle (holding ++alt++ extends this handle to the widget's size to ease dragging). If the widget's position/size was written in percents, the editor will try to keep using percents.

When the grid is enabled, widget resizing / dragging snaps to a 10 pixel wide grid.

## Multi-widgets editing

Multiple widgets can be edited at once.

- The inspector will only display properties that are shared by all selected widgets
- Selection can only contain sibling widgets (same direct parent)
- Context-menu actions and properties changes apply to all selected widgets
- Resizing / Dragging will affect all selected widgets, relatively the selection's size and position


## Keyboard shortcuts

=== "Linux / Windows"

    | Shortcut | Description |
    |---|---|
    | ++ctrl+g++ | Toggle grid. |
    | ++ctrl+t++ | Toggle session tree. |
    | ++ctrl+i++ | Toggle inspector. |
    | ++"Click"++ | Widget selection. |
    | ++ctrl+"Click"++ | Multi-widget selection. Widgets can be toggled from selection by clicking on them individually.|
    | ++shift+"Click"+"Drag"++ | Draw a selection rectangle and attempt to select widgets in it. If ++ctrl++ is pressed too, current selection is kept and will be merged with the new one if possible. |
    | ++ctrl+z++ | Undo |
    | ++ctrl+y++ <br/>++ctrl+shift+z++ | Redo |
    | ++delete++ | Delete selected widgets |
    | ++ctrl+c++ | Copy selected widgets |
    | ++ctrl+x++ | Cut selected widgets |
    | ++ctrl+v++ | Paste clipboard in selected widget |
    | ++ctrl+shift+v++ | Paste and increment id |
    | ++ctrl+d++ | Duplicate selected widget |
    | ++ctrl+shift+d++ | Duplicate selected widget and increment id |
    | ++alt+c+"Drag"++ | Paste selection to position |
    | ++alt+c+shift+"Drag"++ | Paste selection to dragged position and increment id |
    | ++ctrl+up++ <br/>++ctrl+down++ <br/>++ctrl+left++ <br/>++ctrl+right++ | Move selected widgets (1 grid unit, hold ++shift++ for 5 grid units) |
    | ++alt+up++ <br/>++alt+down++ <br/>++alt+left++ <br/>++alt+right++ | Resize selected widgets (1 grid unit, hold ++shift++ for 5 grid units) |
    | ++ctrl+a++ | Select current widget's siblings and itself |
    | ++ctrl+shift+a++ | Cancel current widget selection |
    | ++up++ | Select current widget's previous sibling |
    | ++down++ | Select current widget's next sibling |
    | ++left++ | Select current widget's parent |
    | ++right++ | Select current widget's first child |
    | ++t++ | Show selected widget(s) in the project tree |
    | ++y++ | Show selected widget(s) in the session |
    | ++ctrl+f++ | Focus search input in project tree |
    | ++"Home"++ | Send selected widget to back |
    | ++"Page Up"++ | Send selected widget farther |
    | ++"Page Down"++ | Bring selected widget closer |
    | ++"End"++ | Bring selected widget to front |
    | ++"F2"++ | Bring "label" property input into view if selected widget has one |
    | ++h++ | Hide selection area and widget resize / drag handles while pressed |
    | ++alt+"Mousewheel"++ | change editor zoom |
    | ++ctrl+0++ | reset zoom |


=== "Mac"

    | Shortcut | Description |
    |---|---|
    | ++cmd+g++ | Toggle grid. |
    | ++cmd+t++ | Toggle session tree. |
    | ++cmd+i++ | Toggle inspector. |
    | ++"Click"++ | Widget selection. |
    | ++cmd+"Click"++ | Multi-widget selection. Widgets can be toggled from selection by clicking on them individually.|
    | ++shift+"Click"+"Drag"++ | Draw a selection rectangle and attempt to select widgets in it. If ++cmd++ is pressed too, current selection is kept and will be merged with the new one if possible. |
    | ++cmd+z++ | Undo |
    | ++cmd+y++ <br/>++cmd+shift+z++ | Redo |
    | ++backspace++ | Delete selected widgets |
    | ++cmd+c++ | Copy selected widgets |
    | ++cmd+x++ | Cut selected widgets |
    | ++cmd+v++ | Paste clipboard in selected widget |
    | ++cmd+shift+v++ | Paste and increment id |
    | ++cmd+d++ | Duplicate selected widget |
    | ++cmd+shift+d++ | Duplicate selected widget and increment id |
    | ++alt+c+"Drag"++ | Paste selection to position |
    | ++alt+c+shift+"Drag"++ | Paste selection to dragged position and increment id |
    | ++cmd+up++ <br/>++cmd+down++ <br/>++cmd+left++ <br/>++cmd+right++ | Move selected widgets (1 grid unit, hold ++shift++ for 5 grid units) |
    | ++alt+up++ <br/>++alt+down++ <br/>++alt+left++ <br/>++alt+right++ | Resize selected widgets (1 grid unit, hold ++shift++ for 5 grid units) |
    | ++cmd+a++ | Select current widget's siblings and itself |
    | ++cmd+shift+a++ | Cancel current widget selection |
    | ++up++ | Select current widget's previous sibling |
    | ++down++ | Select current widget's next sibling |
    | ++left++ | Select current widget's parent |
    | ++right++ | Select current widget's first child |
    | ++t++ | Show selected widget in the project tree |
    | ++y++ | Show selected widget(s) in the session |
    | ++cmd+f++ | Focus search input in project tree |
    | ++"Home"++ | Send selected widget to back |
    | ++"Page Up"++ | Send selected widget farther |
    | ++"Page Down"++ | Bring selected widget closer |
    | ++"End"++ | Bring selected widget to front |
    | ++"F2"++ | Bring "label" property input into view if selected widget has one |
    | ++h++ | Hide selection area and widget resize / drag handles while pressed |
    | ++alt+"Mousewheel"++ | change editor zoom |
    | ++cmd+0++ | reset zoom |
