## Interaction

These are interaction events widgets are likely to respond to:

| Mouse | Touch | Description |
|---|---|---|
| Mousedown | Tap | Handled at pressing time, not releasing. |
| Click | Click | Handled at release time. |
| Double Click | Double Tap | Some widgets handle double click / double tap events. |
| Drag | Drag | The widgets respond to mouse and touch drag gestures with a 1:1 precision ratio. |


Widgets sensibility can be tuned with the `sensibility` property. Single-touch widgets (i.e. all widgets except `mutlixy` and `range`) also accept an alternate interaction event for fine control.

| Mouse | Touch | Description |
|---|---|---|
| `Ctrl` + Drag | / | Holding the `Ctrl` key while dragging with the mouse increases the gesture's precision by 10.|
| / | Two-fingers drag | Using two fingers on a single-touch target increases the gesture's precision by 10. |


## Sending messages

When interacted with, widgets with at least one target (including the server's defaults) send osc messages of the following form:

```
/address ...preArgs ...value
```

If they have MIDI targets, the server will try to convert the osc messages into a MIDI messages (see [MIDI messages](../midi/midi-messages.md)).


## Receiving messages

When an osc message is received, it updates every widgets that meets the following conditions

- same `address`
- same `preArgs` (no distinction between integers and round floats )

The remaining arguments after `preArgs` are passed to the widget.


When a MIDI message is received, it's converted into an osc message (see [MIDI messages](../midi/midi-messages.md)) and follows the same rules, except that only the widgets that include the emitting MIDI device in their targets will be able to receive it.   


## Widget synchronization

Within a single client's scope, there are multiple ways to synchronize widgets:

- If they share the same `id`: in this case, the synchronized widget doesn't send any osc/midi message. This case is mostly used for widget cloning.
- If they share a `linkId`: in this case, the synchronized widget sends its osc/midi message normally.
- If their `value` properties depend on each other using the [advanced syntaxes](./advanced-syntaxes.md)
- Using [scripting](./scripting.md)

## Client synchronization

From a client to another, widgets are automatically synchronized if they share the following properties:

- `address`
- `preArgs`
- `targets`

Client synchronization can be disabled globally with the `clientSync` [client option](../client-options.md). Widgets with `bypass` set to `true` will not send synchronization messages to other clients.
