---
title: How it works
---

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
