
# legendary-pancake homepage

Points of interests:

- __src/pages.js__ defines all the routes.
  It is used by browser.js and prerenderer.js.

  Since it’s just JavaScript, you can also generate your routes from JSON files.
  This makes it easy to use `legendary-pancake` to generate a super fast documentation site!

- __src/browser.js__ defines the browser entry point.

- __src/prerenderer.js__ defines the logic to generate a HTML file.

- __src/index.html__ is the HTML template for using in development server.
