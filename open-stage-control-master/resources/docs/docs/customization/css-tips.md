# CSS Tips

## Browser inspector


Hit ++f12++ to open the developers tools panel. The html/css inspector helps retrieving the class names needed to style specific parts of the widgets: hit ++ctrl+shift+c++ or click on the inspect icon (![x](/img/inspect.png)) and click on a element in the interface to reveal its html code.


## Inline syntax

For simple use cases, the `css` property can be written as a HTML inline styles (without any CSS selector). CSS rules will apply to the widget element.

```css
opacity: 0.5; /* make the widget transparent */
font-size: 120%; /* increase font-size */
```


## Selector syntax

CSS selectors can be used to apply styles to specific elements:

```css
:host {
    /* style for the widget element
       & { } also works (deprecated)
    */
}

label {
    /* style for the label elements */
}

> label {
    /* style for the direct child label element */
}

```

!!! info ""
    Mixing Inline and Selector syntaxes doesn't work, once you use selectors, you have to use the `:host` selector to target the widget element.

## Extra css classes: `class`

This non-standard css property can be used to add custom css classes to the widget element: `class: my-custom-class;`
Multiple classes can be added (one per `class` statement). Custom classes are always added to the widget's root element, css selectors are ignored.

!!! info ""
    Using class names that are already used in the app can be hazardous. In order to avoid that, custom class names should be prefixed with something uncommon and preferably cool, such as `xxx-myclass` or `crispy-seitan-myclass`.

## Layering: `z-index`

Z-Axis ordering can be set using the `z-index` rule. Widgets positioned at absolute coordinates (when `top` or `left` is different from `auto`) have `z-index:10;` by default.

## Responsive sizing

In most cases, using `vertical`, `horizontal` or `grid` layouts as well as using percentages in `height` and `width` will do. CSS `calc()` function can help in some cases (set the corresponding property to `auto` to avoid conflicts):

```css
:host {

    width: calc(100% - 100rem);

}
```

Media queries can also be used:

```css
@media screen and (min-width: 768px) {

    :host {

        /* style the widget if the screen is bigger than 768px */

    }

}
```


## Size units

- use `rem` instead of `px` (`px` values will not scale when zooming), except for media queries
- use `%` for font-size


## CSS variables

[CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) declared in the  [default theme](https://github.com/jean-emmanuel/open-stage-control/blob/master/src/scss/themes/default.scss) can be overridden.

Widgets also rely on CSS variables for the style properties (colors, padding, etc). These are documented in the widgets' `css` property description.

# Loading images

Image urls are resolved in this order:
- in the session's directory
- in theme's directory
- in the server's `remote-root` directory if the option is set
- as absolute paths
