// Import the required node modules
const path = require('path');

// Import the required utils
const { findAliases, findSourceDirectory } = require('./utils');

// Define module exports
module.exports = {};

// Define the babel config function
module.exports.babelConfig = (extensions = {}) => {

  // Find the source directory
  const sourceDirectory = findSourceDirectory();

  // Find the aliases
  const aliases = findAliases();

  // Define the plugins
  const plugins = [

    // Add the module resolver plugin
    ['module-resolver', {

      // Correctly resolve the aliases
      resolvePath(source, current) {

        // Find the alias from the source before the first slash
        const match = Object.entries(aliases).find(([alias]) => source.split(path.sep)[0] == alias);

        // If there source has no alias then return the source
        if (!match) return source;

        // Extract the alias and the real path from the match
        const [alias, real] = match;

        // Calculate the number of splits
        const splits = current.split(path.sep);

        // Check if the last split contains a '.' (is a file)
        if (splits[splits.length -1].indexOf('.') > -1) {

          // Delete the last split
          splits.splice((splits.length -1), 1);
        }

        // Redefine the current path with the filename removed from the end
        current = splits.join(path.sep);

        // Replace the alias with the real path in the source
        source = source.replace(alias, real);

        // Convert the source path to an absolute path
        source = path.resolve(sourceDirectory, source);

        // Return the relative path from the current file to the source
        return path.relative(current, source);
      }
    }]
  ];

  // Add any extra plugins
  if (extensions.plugins) plugins.push(...extensions.plugins);
  
  // Return the configuration
  return {
    presets: [
      ['@babel/preset-env', {
        loose: true,
        targets: {
          node: true
        }
      }]
    ],
    minified: true,
    comments: false,
    ...extensions,
    plugins
  }
}