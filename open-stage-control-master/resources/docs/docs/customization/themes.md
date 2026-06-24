## Built-in themes

Themes can be loaded with the `--theme` option. Multiple themes can be combined. Built-in themes can be loaded using their name, custom theme files can be loaded using their path.

Available themes (full color scheme):

- `nord`: arctic color palette (https://www.nordtheme.com/)
- `orange`: grey and orange theme

## Creating a custom theme

Creating a custom theme is as simple as writing a tiny css file that will override the default css variables defined in [default.scss](https://github.com/jean-emmanuel/open-stage-control/blob/master/src/scss/themes/default.scss) :

```css
:root {
	--color-accent: red;
}
```

This will change the default accent color to red. Variables can also be overridden for a specific subset of elements, for example :

```css
.panel-container {
	--color-accent: blue;
}
```

This will change the default accent color to blue for all elements in panel widgets.

## Autoreload

Theme files are reloaded automatically when they are modified.

## SCSS

If you want to use the [SCSS](https://sass-lang.com/documentation/syntax) syntax to write your theme, follow the [Running from sources](../../getting-started/running-from-sources) instructions, create a `.scss` file in `src/scss/themes/` and run `npm run watch-css`. The theme will be watched and compiled automatically to a css file located in `app/assets/themes/` (css files in this directory can be selected from the theme option by their name, without .css suffix).
