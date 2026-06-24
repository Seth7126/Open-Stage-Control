# Advanced syntaxes

Advanced syntaxes are special blocks of code that can be written in the widgets properties to customize the widgets and how they behave. These blocks end up replaced with the value they hold before the widgets evaluate the properties they're in.


## Inheritance: `@{id.property}`

The inheritance syntax returns either a widget's value or one of its properties. When using this syntax, value or property changes will be applied automatically.

- `id`: target widget's `id`. A widget can fetch its own properties or its direct parent's by using the keywords `this` or `parent` instead of `id`. When `this` or `parent` can be used, using the target widget's `id` instead won't work.
- `property`: target widget's property name. If omitted (along with the dot), the widget's value will be returned (`@{widgetId}` is the same as `@{widgetId.value}`). `value` always resolves to the target widget's current value, not its `value` property.


!!! note "Unique identifier"
    Each widget has a unique random identifier that can be retrieved with the property name `uuid` (e.g. `@{this.uuid}`, `@{parent.uuid}`).

#### Dynamic properties

Some properties, when changed, trigger a complete widget recreation that ends any ongoing user interaction. Also, updating these properties continuously (e.g. when linked to a slider's dynamic value) can be very cpu expensive.

Some properties have much cheaper update routines and can be considered as `dynamic`, as in performance safe. These properties are marked in the documentation with a <i class="fas fa-bolt" title="dynamic"></i>.


#### Circular references cases

- container widgets can inherit their children's properties only to define `dynamic` properties
- widgets can inherit their own `value`<i class="dynamic-prop-icon" title="dynamic"></i> property only to define `dynamic` properties

#### Object properties

If the retrieved property is an object (`{}`), a subset can be retrieved directly by appending a dot and a key (array index or object key) : `@{parent.variables.key}`


#### Nesting

The inheritance syntax supports 1-level nesting for defining the target widget's id dynamically : `@{fader_@{toggle_1}}`


## OSC listeners: `OSC{address, default, usePreArgs}`

The OSC listener syntax returns the value received on specified address (or the `default` value if none has been received yet).

- `address`: osc address to listen to; if the leading slash (`/`) is omitted, the address will be prefixed with the widget's `address` property
- `default` (optional): default value returned before any message is received. Must be a primitive value, not an object or an array.
- `usePreArgs` (optional): by default, osc listeners inherit the widget's `preArgs` (these must be matched for the osc messages to be processed). Set to `false` bypass them.

Options can contain `@{}` blocks.

!!! note "Receiving MIDI"
    Midi messages will be processed only if the receiver's widget includes the emitting MIDI device in its targets.  

??? example "Array/Object default value"
    ```js
    JS{
        return OSC{address} || {
            "key a": 1,
            "key b": 2
        }
    }
    ```

## Custom variables: `VAR{variableName, default}`

This syntax creates a custom variable in the widget that can be read and modified from any widget's script property (see [scripting](./scripting.md#getvarid-name)). Changes made to this variable using `setVar()` in scripts will be applied automatically where `VAR{}` is used.`

## File imports: `IMPORT{file_name}`

This allows loading the content of an external file in a property. If used in a `JS{}` of `#{}` block, it will be seen as a string variable containing the raw content of the file. Changes made to the file be applied automatically.

File paths are resolved in this order:

- in the session's directory
- in theme's directory
- in the server's `remote-root` directory if the option is set
- as absolute paths

!!! warning
    [Fragments](../fragments/) and session files already loaded with fragment widgets should not be imported using this syntax.

## Javascript: `JS{ <code> }`

This syntax allows defining a property using [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript). The code will be compiled as a function and executed in a restricted context.

- if no `return` statement is found, the formula will return an empty string
- javascript [strict mode](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Strict_mode) is always enabled
- `setTimeout` and `setInterval` functions are not available

A property *cannot* contain multiple `JS{}` blocks

#### Available variables

- `console`: javascript console
- `locals`: object for storing/reading arbitrary values. Changing its properties *does not* trigger any synchronisation even if the value is used somewhere else.
- `globals`: same as `locals` but shared between all widgets, contains a few useful variables:
    - `screen`: client screen informations (`{width, height, orientation}`)
    - `env`: client options (ie: url query options),
    - `ip`: client's ip address,
    - `url`: server url,
    - `platform`: operating system as seen by the client
    - `session`: session file path
    - `clipboard`: instance of navigator [Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard)

Parsing errors can be read in the console (++ctrl+k++).

!!! warning
    Modifying values in `locals` or `globals` **does not** trigger anything if they are used somewhere else.

#### Using in advanced syntaxes

In this context, `@{}`, `VAR{}` and `OSC{}` syntaxes are seen as variables. When they change, the whole block will be evaluated again.

!!! danger "Do not mutate"
    When these syntaxes return objects or arrays, mutating said objects will affect the underlying variables in memory and may lead to unexpected behavior.

    The `@{}` syntax, when used for anything else than the widget's value, will always return a copy of the property and is not affected by this.

## Javascript: `#{ <code> }`

This is a shorthand for the `JS{}` syntax, the only difference being that `<code>` is automatically prepended with a `return` statement.

A property *can* contain multiple `#{}` blocks.

!!! note "Compilation order"
    `#{}` blocks are compiled after `JS{}` blocks
