# Change a widget property with an osc message

By default, widgets only expose their value to incoming messages, but there are multiple ways to allow changing any widget property using osc messages as well. In this tutorial we'll explore the different possibilities for exposing the `visible` property of a widget to incoming messages, but it applies to any other property.

## 1. Using a variable widget

Create a variable widget and set up its `address` (and `preArgs` if needed) so that it receives the messages you want to use, and then in your other widget's `visible` property, use the [inheritance syntax](../widgets/advanced-syntaxes.md#inheritance-idproperty) to retrieve the variable's value:


=== "Inheritance syntax"
    ```
    @{variable_id}
    ```
=== "Inheritance syntax + Javascript"
    ```js
    JS{
        // bonus, in case you don't want to use the variable's value as-is
        if (@{variable_id} > 0.5) {
            return true
        } else {
            return false
        }
    }
    ```

Now the variable's value will determine the visibility of the widget.  The `visible` property expects a boolean value (`true` for visible, `false` for invisible) but any [truthy](https://developer.mozilla.org/en-US/docs/Glossary/truthy) / [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) will do (e.g. `1` for visible, `0` for invisible is a sensible choice).

## 2. Using the OSC listener syntax

The [OSC listener syntax](../widgets/advanced-syntaxes.md#osc-listeners-oscaddress-default-usepreargs) might be a more straightforward solution for simple use cases. Writing this in a widget's `visible` property:


=== "Relative address"
    ```
    OSC{show}
    ```

will listen for messages on address `/widget_address/show` and return the last received value.


If we write this instead:

=== "Absolute address"
    ```
    OSC{/show}
    ```

the address will be `/show` and won't be prefixed with the widget's address as before.


It is often needed to specify the initial state of the listener (before it receives any message), this is done via the second argument of the listener syntax:


=== "Default value (true)"
    ```
    OSC{show, true}
    ```
=== "Default value (truthy)"
    ```
    OSC{show, 1}
    ```
=== "Default value (false)"
    ```
    OSC{show, false}
    ```
=== "Default value (falsy)"
    ```
    OSC{show, 0}
    ```

If the widget has any preArgs set, the osc listener will inherit them by default, this means that for a message to change the listener's value it will not only have to match its address but also the widget's `preArgs`, this can be prevented using the third argument of the listener syntax:

=== "Ignore preArgs"
    ```
    OSC{show, 1, false}
    ```


## 3. Using custom variables

The [custom variable syntax](../widgets/advanced-syntaxes.md#custom-variables-varvariablename-default) connects regular properties and scripting properties (`onCreate`, `onValue`, etc), writing this in the `visible` property:

```
VAR{show}
```

will create a custom variable named `show` scoped to the widget (custom variables do not use a global namespace and multiple widgets may use the same names for their custom variables without conflict). This custom variable can be read and set from any widget scripting property using the [`getVar()` / `setVar()`](../widgets/scripting.md#getvarid-name) functions.

For instance, we could use a variable widget as osc receiver like in the first example of this tutorial and use it's `onValue` script to change the custom variable's value (instead of using the inheritance syntax):

```js
// variable widget onValue
// simply pass received value to the custom variable
setVar('widget_id', 'show', value)
```


The custom variable's initial state can be specified:

```
VAR{show, 1}
```

## 4. Using /EDIT commands

The [`/EDIT`](../remote-control.md) remote control command can be used to modify any widget property in the session, for instance:

```
/EDIT widget_id '{visible: false}'
```

Will hide the widget with id `widget_id`. Note that this is different from the 3 techniques described above in that it actually modifies the session and changes the property value in a destructive way (the property is rewritten, not just its state). When quitting the session after using it a warning indicating the session has unsaved changes will be shown, this can be prevented by appending a extra argument to the message:

```
/EDIT widget_id '{visible: false}' '{noWarning: true}'
```

Note that the arguments after `widget_id` are sent as strings ([JSON5](https://github.com/json5/json5)-encoded objects), this is because sending plain javascript object over osc is not possible.  

## Bonus: custom module

Any of these techniques can be used in conjunction with a [custom module](../custom-module/custom-module.md). Using the `receive()` function allows simulating incoming osc messages and can be used to trigger property changes:

=== "Variable widget"
    ```js
    var visible = true
    receive('/variable_id', visible)
    // or if variable widgets has preArgs
    receive('/variable_id', preArg1, preArg2, visible)
    ```
=== "OSC listener"
    ```js
    var visible = true
    receive('/widget_address/show', visible)
    // or if listener has preArgs
    receive('/widget_address/show', preArg1, preArg2, visible)
    ```
=== "Custom variable"
    ```js
    var visible = true
    receive('/SCRIPT', `setVar('widget_id', 'show', ${visible})`)
    ```
=== "/EDIT command"
    ```js
    var visible = true
    // what's really cool here is that you don't need to stringify objects arguments
    // receive() will take care of that for you
    receive('/EDIT', 'widget_id', {visible: visible}}, {noWarning: true})
    ```
