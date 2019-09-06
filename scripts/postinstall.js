#!/usr/bin/env node

// Import the required node modules
const path = require('path');

// Import the required utils
const { addPrepublishOnlyScript, copyResource } = require('../lib/utils');

// Return the script running in development
if (path.resolve(process.env.INIT_CWD, 'scripts') == __dirname) return;

// Copy the files to the project folder
copyResource('.babelrc.js');

// Add the 'prepublishOnly' script to npm, and if this succeeds add the 'pre-commit' hook to git
if (addPrepublishOnlyScript()) copyResource('git-hooks/pre-commit', '.git/hooks/pre-commit');