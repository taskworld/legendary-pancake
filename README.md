# legendary-pancake

> Great repository names are short and memorable. Need inspiration? How about __legendary-pancake__.
> —GitHub

__legendary-pancake__ is an __advanced__ static site generator based on Webpack, React and React Router.
It is designed for advanced users and gives you total control of:

- __Your site structure.__
  Unlike [Gatsby](https://github.com/gatsbyjs/gatsby), it doesn’t define routes based on filesystem layout.
  You define all the routes programmatically.

- __How you write CSS.__
  PostCSS? PreCSS? cssnext? Sass? LESS? Stylus? CSS Modules? Autoprefixer? Inline Styles?
  legendary-pancake has no preference on this.

- __The prerendering process.__
  You decide how your React element gets turned into an HTML file.

  You can use libraries like [react-document-title](https://github.com/gaearon/react-document-title), [react-helmet](https://github.com/nfl/react-helmet) to help with `<head>` elements, or roll your own solution.

  Inline your CSS or JS in your HTML file, or put it in another chunk. It’s all up to you.

- __Route loading.__ legendary-pancake has no preference on how to load your page contents.
  Use webpack’s [code splitting](https://webpack.github.io/docs/code-splitting.html) or [bundle-loader](https://github.com/webpack/bundle-loader) to load your site content asynchronously, either eagerly or on-demand.

  Split chunks by page, or group related pages together.
  You are in total control.

- __Your deployment process.__
  The pages will be built in `build/pages` and other webpack assets in `build/browser`.
  The rest is up to you.
  By separating the data from the assets, this allows for some advanced use-cases, such as A/B testing a static site.

But `legendary-pancake` will take care of these for you:

- __Development and building workflow.__
  It comes with a CLI tool to run the development server,
  build webpack bundles and prerender pages.

- __Managing URLs and route transitions.__
  legendary-pancake preconfigures React Router to support asynchronous routing and prerendering at the same time, and abstracts it away behind an API that is more suited for static routes.
