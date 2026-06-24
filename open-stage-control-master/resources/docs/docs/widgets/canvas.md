# Canvas widget

The canvas widget allows creating custom widgets with user-defined drawings and touch reactions.

It has two special properties, `touch` and `draw`, that work like the `script` property : they are used to defined scripts that will be executed when specific events occurs.

This widget requires a good understanding of the javascript [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) and of the javascript programming language in general.

## Canvas properties

### `valueLength`

This property must be set to the number of values held by the widget : 1 for a simple slider, 2 for an XY pad, etc. Attempts to set the widget's value with a different number of values will be ignored.

```js
set("this", 1) // works if valueLength == 1
set("this", [1, 2]) // works if valueLength == 2
```

### `autoClear`

This is a convenience option that clears the canvas context and calls [`beginPath`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath) before each drawing. When this property is set to `false`, the canvas must be cleared manually.

### `continuous`

If this property is enabled, the widget will be redrawn at a fixed rate even if not interacted with (see [`onDraw`](#onDraw)).


### `onTouch`

This script is executed when the widget is touched, when it is released, and during the movement of the pointer while the widget is touched.

This script has access to the same variables and functions as the `script` property (except the event-specific ones), plus the following:

- `value`: widget value
- `width`: canvas width in pixels
- `height`: canvas height in pixels
- `event`: object containing the following:
    - `type`: `"start"`, `"move"` or `"stop"`
    - `target`: id of the widget under the pointer, `"this"` if it's the canvas widget itself, `null` if no widget is under the pointer
    - `targetName`: name attribute of the html element under the pointer
    - `targetTagName`: tag name of the html element under the pointer
    - `offsetX`, `offsetY`: touch coordinates in pixels, relative to the html element under the pointer
    - `movementX`, `movementY`: movement of the pointer in pixels since the last event
    - `pageX`, `pageY`: touch coordinates in pixels, relative to the page
    - `pointerId`: unique identifier used to differentiate fingers in multitouch situation
    - `altKey`, `ctrlKey`, `shiftKey`: keyboard modifier states
    - `force`: amount of pressure applied to the touch surface between `0` and `1` (see [Touch.force](https://developer.mozilla.org/en-US/docs/Web/API/Touch/force)). Equals `0` if the API is not supported or if no pressure information is found.
    - `radiusX`, `radiusY`, `rotationAngle`: see [Touch.rotationAngle](https://developer.mozilla.org/en-US/docs/Web/API/Touch/rotationAngle)
    - (iOS only) `altitudeAngle`, `azimuthAngle`: see [Touch.altitudeAngle](https://w3c.github.io/touch-events/#dom-touch-altitudeangle)
    - (iOS only) `touchType`: "direct" or "stylus"


!!! note "Extra html elements"
    Elements added using the `html` property can be touched as well, `event.targetName` can be used to determine which element is touched.


### `onDraw`

This script is executed when the widget should be redrawn, which is when it's touched and when it receives a value.

This script has access to the same variables and functions as the `script` property (except the event-specific ones), plus the following:

- `value`: widget value
- `width`: canvas width in pixels
- `height`: canvas height in pixels
- `ctx`: [canvas rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) of the widget
- `cssVars`: object containing the computed value of some of the widget's style properties such as `colorWidget`, `alphaFill`, `padding`, etc

### `onResize`

This script is executed when the widget has resized, before it is redrawn.

This script has access to the same variables and functions as the `script` property (except the event-specific ones), plus the following:

- `value`: widget value
- `width`: canvas width in pixels
- `height`: canvas height in pixels
- `cssVars`: object containing the computed value of some of the widget's style properties such as `colorWidget`, `alphaFill`, `padding`, etc

## Example: XY pad

Let's create a simple xy pad, with a value made of two numbers between 0 and 1. We set `valueLength` to `2` to make sure the widget only accepts incoming messages with two values (x and y).

First, we use the `onTouch` property to store the touch coordinates in the `locals` object. We also call `set()` to store these in the widget's value (this way, the widget can send messages and sync with other widgets).

```js
// onTouch

// store normalized coordinates
if (event.type == "start") {
    locals.x = event.offsetX / width
    locals.y = event.offsetY / height
} else {
    // when the pointer is moving, increment coordinates
    // because offsetX and offsetY may not be relevant
    // if the pointer hovers a different widgets
    locals.x += event.movementX / width
    locals.y += event.movementY / height
}

// update widget value and send
set("this", [locals.x, locals.y])
```

Then, we use the `onDraw` property to draw a circle at the touch coordinates.

```js
// onDraw

// draw circle at touch coordinates
ctx.arc(value[0] * width, value[1] * height, 6, 0, Math.PI * 2)
// use colorFill property as stroke color
ctx.strokeStyle = cssVars.colorFill
// draw stroke
ctx.stroke()
```

Finally, we use the `onValue` property to apply limits to the values.

```js
// onValue

// apply limits
var x = Math.max(0, Math.min(1, value[0])),
    y = Math.max(0, Math.min(1, value[1]))

// re-update widget value without retriggering script or sending message
set("this", [x, y], {sync: false, send: false})

// the widget will automatically send its value if
// this script was triggered by a user interaction
// no need to call send() here but we could, for example
// if we want to split the value in to multiple messages
```

## Example: multi slider

Let's build a row of 20-sliders with a single widget. We first set `valueLength` to... 20 !

```js
// onTouch

// store normalized coordinates
if (event.type == "start") {
    locals.x = event.offsetX / width
    locals.y = event.offsetY / height
} else {
    // when the pointer is moving, increment coordinates
    // because offsetX and offsetY may not be relevant
    // if the pointer hovers a different widgets
    locals.x += event.movementX / width
    locals.y += event.movementY / height
}


// which slider are we touching ?
var n = parseInt(locals.x * value.length)
n = Math.max(0, Math.min(n, value.length-1))

// update value at slider's index
// 1 - locals.y because y axis is from top to bottom in js canvas
value[n] = 1 - locals.y

// update widget value and send
set("this", value)
```

```js
// onDraw

ctx.fillStyle = cssVars.colorFill
ctx.globalAlpha = cssVars.alphaFillOn

var sliderWidth = width / value.length - 1
for (var i in value){
    ctx.beginPath()
    ctx.rect(i * width / value.length, height, sliderWidth, - value[i] * height)
    ctx.fill()
}
```

```js
// onValue

// apply limits
for (var i in value) {
    value[i] = Math.max(0, Math.min(1, value[i]))
}

// re-update widget value without retriggering script or sending message
set("this", value, {sync: false, send: false})
```
