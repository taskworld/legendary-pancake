---
title: Getting started
order: 1
---

This document will guide you through setting up `legendary-pancake`.

As I’ve probably said before, legendary-pancake is an ___advanced___ tool;
it doesn’t try to shield you away from the intricacies of webpack.
While this means it will take some time to set up a project,
it gives you a lot of flexibility (see the Intro page).

Therefore, this guide assumes knowledge of configuring webpack,
using loaders and doing code splitting.


# Setting up the project

Create an empty directory for your website:

```bash
mkdir my-site
cd my-site
```

Inside it we will create a directory to hold our site’s source code:

```bash
mkdir src
```

Initialize a package:

```bash
yarn init -y
```

Install legendary-pancake into the project:

```bash
yarn add --dev legendary-pancake
```


## Set up command-line scripts

Modify `package.json` to add these scripts:

```js
  "scripts": {
    "start": "legendary-pancake server",
    "build": "legendary-pancake build",
    "clean": "legendary-pancake clean"
  }
```

This allows us to run `legendary-pancake` easily.


## Babel

Since we’re going to use React and JSX, we have to transpile our JSX (and ES2016)
code into normal JavaScript. We’ll use Babel:

```bash
yarn add --dev \
  babel-core \
  babel-loader \
  babel-preset-es2015 \
  babel-preset-es2016 \
  babel-preset-stage-2 \
  babel-preset-react
```

Then we configure Babel by creating a `.babelrc` file:

```js
{
  "presets": [
    "es2015",
    "es2016",
    "stage-2",
    "react"
  ]
}
```


## React

Next, we need to install React and React DOM to our project:

```bash
yarn add react react-dom
```


## legendary-pancake

Next, we create a `legendary-pancake.config.js` file and tell it to load our JavaScript files (in `src` directory) using `babel-loader`.

```js
'use strict'
const path = require('path')

exports.configureWebpack = (config) => {
  // Babel
  config.module.loaders.push({
    test: /\.js$/,
    include: path.join(__dirname, 'src'),
    loader: 'babel-loader'
  })
  return config
}
```

We defined a `configureWebpack` function, which will be given a webpack
configuration object. This function should return a modified webpack
configuration.

> Since the configuration module is simply a JavaScript file, you may create
> a shared configuration and put it on (e.g.) npm so that your projects can
> re-use this configuration.


## Define pages

Next, we’ll define our pages.

Add this to `src/pages.js`:

```js
import React from 'react'
import { Link } from 'legendary-pancake'
import Layout from './Layout'

export default {
  '/': (callback) => {
    callback(<Layout>Home page</Layout>)
  },
  '/about/': (callback) => {
    callback(<Layout>About page</Layout>)
  },
  '/contact/': (callback) => {
    callback(<Layout>Contact page</Layout>)
  },
  '/404.html': (callback) => {
    callback(<Layout>Contact page</Layout>)
  }
}
```

We defined our pages by exporting an object whose keys are pathnames,
and whose values are functions. These functions should take a callback and
calls it with the page’s content.

> The pathname `/404.html` is special, because it will be used when the
> requested pathname is not found.

> It is important to __always__ end a pathname with `.html` or `/`,
> because otherwise, you may not be able to host the resulting site
> on a static file server! (such as GitHub pages)


## The Layout

Create `src/Layout.js`; it is used by `pages.js` (above):

```js
import React from 'react'

function Layout ({ children }) {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/about/'>About</Link></li>
          <li><Link to='/contact/'>Contact</Link></li>
        </ul>
      </nav>
      <main>
        {children}
      </main>
    </div>
  )
}
```


## Development template

Next, create an HTML template file, `src/dev.html`.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>legendary-pancake development mode</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

This is called a “development template” because it is only used during development.
This file will be served by the development server.

> You don’t need to include any `<script>` tags, because
> [HtmlPlugin][html-webpack-plugin] will inject the appropriate `<script>`
> tags into the template.

We will use another kind of template when we build the site into HTML files.
It is a good idea to keep these templates as small as possible.


## Browser entry point

Next, we will create an entry point for the browser, `src/browser.js`.

```js
import { createRenderer } from 'legendary-pancake'
import pages from './pages'

const renderer = createRenderer(pages)
renderer.renderTo(document.getElementById('app'))

if (module.hot) {
  const onHotReload = renderer.createHotReloadHandler(() => require('./pages').default)
  module.hot.accept('./pages', onHotReload)
}
```

This file will be run on the client when user loads the page.

> The renderer returned by the `createRenderer` function will take care of
> rendering your pages according to the routes you defined earlier.


## Running the development server

All the basic configuration has been set up.
Now it’s time to run the development server!
Run this command:

```bash
npm start
```

If the build is successful, you should see something like this in the Terminal:

```
* Preview at: http://localhost:9000/
webpack built 55309105e99f2d88fbe8 in 2500ms
```

Open that URL, then you should be able to navgiate around the site.
You can edit any file, and you will also see your changes hot-reloaded.


## Creating a prerenderer

Now, to build this site into static HTML files, we need to create a prerenderer.

Create `src/prerenderer.js`:

```js
import ReactDOMServer from 'react-dom/server'
import { createPrerenderer } from 'legendary-pancake/prerenderer'

import pages from './pages'

export const prerenderer = createPrerenderer(pages, {
  renderPage (content, { stylesheets, javascripts }) {
    const contentHtml = ReactDOMServer.renderToString(content)
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>My website</title>
  ${stylesheets}
</head>
<body>
  <div id="app">${contentHtml}</div>
  ${javascripts}
</body>
</html>`
  }
})
```

This module exports a `prerenderer`, which contains all the logic needed to
turn each page into HTML files.


## Building the static website

Now with the prerenderer in place, we can build our project into a static website!
Run:

```bash
npm run build
```

You should see an output similar to this:

```
* Written build/browser/index.html (724B)
* Written build/browser/about/index.html (727B)
* Written build/browser/contact/index.html (729B)
* Written build/browser/404.html (732B)
* Prerendered 4 pages.
```

If you look in your `build/browser` directory, you will see all your pages
are rendered into static HTML files!


## Previewing the static website

Now, with the static website built, we can try serving it up using a static web server!

```bash
yarn global add http-server
http-server build/browser
```

Congratulations!

You have set up a basic legendary-pancake project.


# How it really works

Now, let’s learn how legendary-pancake prerenders your web site.


## Building static pages

When you run `legendary-pancake build`,

1. It cleans the `build` directory.

2. It uses webpack to generate two bundles:

    - __The browser bundle.__ It will be run by the client.

        - Generate a bundle from `src/browser.js`.

        - Extract CSS using ExtractTextPlugin.

        - Minify the code using UglifyPlugin.

        - Save the assets into `build/browser` folder.

    - __The prerendering bundle.__ This bundle contains the logic to generate
      static HTML files from your project.

        - Generate a bundle from `src/prerenderer.js`, targeting Node.js.

        - Save the assets into `build/prerenderer` folder.

3. It prerenders the pages.

    - It requires the prerenderer bundle.

    - It asks the prerenderer for the list of available pages that needs to
      be renderered.

    - For each route, it asks the prerenderer to render it.

    - The results are saved to `build/browser`.
