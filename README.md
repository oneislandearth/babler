<p align="center">
  <a href="https://github.com/oneislandearth/babler" target="_blank">
    <img src="https://i.imgur.com/7TodgrS.png">
  </a>
</p>

***

The perfectly simple version of Babel configured for packing your packages

## Installation

[Babler](https://github.com/oneislandearth/babler) is available through the [npm registry](https://www.npmjs.com/package/@oneisland/babler):

```bash
$ npm install @oneisland/babler
```

## Usage

The Babler configuration can be extended from within the [.babelrc.js](https://babeljs.io/docs/en/config-files) in your project directory by passing any [Babel options](https://babeljs.io/docs/en/options#) to the `babelConfig` function. 

##### .babelrc.js (example)

```js
// Import the babel config
const { babelConfig } = require('@oneisland/babler');

// Export the babel config (passing some options)
module.exports = babelConfig({

  // Set the presets to stage-0
  presets: ['@babel/preset-stage-0']

  // Allow comments
  comments: true,

  // Prevent minification of codes
  minified: false
});
```

The Babler CLI can be executed from within any [npm script](https://docs.npmjs.com/cli/run-script).

When installing Babler, a `prepublishOnly` script will be added to your `package.json` (if one does not already exist).

##### package.json (example)

```js
{
  "name": "babler-test",
  "version": "0.0.1",
  "description": "A test package using Babler",
  "main": "dist/index.js",
  "scripts": {
    "prepublishOnly": "oneisland-babler dist"
  }
}
```

The argument `dist` passed to the Babler CLI represents the output folder for the code after it has been run through Babler.

Babler supports path alias resolving similar to [Webpack](https://webpack.js.org/configuration/resolve/#resolvealias).

On execution, Babler will resolve path aliases using the `baseUrl` and `paths` in your [jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig).

Babler will also add a git `pre-commit` hook if possible which will run your `prepublishOnly` script.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, OneIsland Limited
