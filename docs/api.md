---
title: API
---

# legendary-pancake.config.js {#config}

The `legendary-pancake.config.js` file is read by the `legendary-pancake` CLI tool
and is used to configure webpack.

It should export a configuration object, which may contain these members:


## configureWebpack(config, pancake) {#config-configureWebpack}

legendary-pancake will use this function to let you customize the webpack config.
It will be given these arguments:

- `config` The base webpack configuration. You can mutate this object directly
  to modify the configuration.

- `pancake` An object with extra information about the build, as well as some
  extra helpers.

It should return the modified webpack configuration.


### pancake {#config-pancake}

The `pancake` object has these properties:

- `webpack` The webpack module (`require('webpack')`).

- `env` A string representing the build target.

  - `"development"` when running the development server
  - `"prerenderer"` when building the prerenderer
  - `"production"` when building the production page

- `css(loader)` adapts css-loader for hot-reloading (development) and extraction
  into a separate CSS file (build). See [CSS](css.md) page for more details.



## splitPages {#config-splitPages}

Configures whether legendary-pancake should build the HTML files into a different
folder from the assets folder.

- If `false` (default), the HTML pages will be saved to `build/browser`.

  This is the same directory as the assets. This means you can upload this
  directory to a static web host immediately.

- If `true`, the HTML pages will be saved to `build/pages` instead.

  This is useful in case the HTML files should be served by a different
  server, which allows for (e.g.) A/B testing and [content negotiation](https://en.wikipedia.org/wiki/Content_negotiation).



## basePathname {#config-basePathname}

By default, legendary-pancake builds your page expecting that it will be
hosted on the root path.

If that’s not the case, you need to configure `basePathname` to point to the
pathname where your web pages will be hosted.

Usually, this should be the same as `config.output.publicPath` in webpack configuration.



# createRenderer(options) {#createRenderer}

TODO



# createPrerenderer(options) {#createPrerenderer}

TODO
