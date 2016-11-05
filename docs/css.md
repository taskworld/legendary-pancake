---
title: Using CSS
---

This page assumes that you have a working legendary-pancake website now.
Now we’ll learn how to add CSS to your page.


# Adding loaders

First, we’ll need to teach legendary-pancake to treat certain files as CSS.
For the sake of example, we’ll write our stylesheet using [Less.js](http://lesscss.org/).


## Install the dependencies

Let’s install these dependencies:

```bash
yarn add --dev less less-loader css-loader
```

> `less-loader` uses `less` to transform Less code into CSS.
>
> `css-loader` resolves imports and urls referenced in the CSS code.
>
> __Don’t install__ `style-loader` because legendary-pancake has an alternative.


## Configure the loaders

Add this to your `configureWebpack` function:

```js
  config.module.loaders.push({
    test: /\.less$/,
    loader: pancake.css('css-loader!less')
  })
```

We used a helper, `pancake.css`, to load the CSS in an appropriate way.

- During development, CSS is loaded using `style-loader`.

- During build, the CSS is extracted using ExtractTextPlugin and saved into a CSS file.
  The extracted CSS file will be available inside `renderContext.stylesheets` during prerendering.
