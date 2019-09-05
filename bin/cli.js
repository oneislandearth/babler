#!/usr/bin/env node

// Import the required node modules
const { execSync } = require('child_process');

// Import the required utils
const { findSourceDirectory } = require('../lib/utils');

// Work out the output directory from the cli input or fallback to 'dist'
const outputDirectory = ((process.argv[2]) ? process.argv[2] : 'dist');

// Run the files in the source directory through babel
execSync(`babel ${findSourceDirectory()} -d ${outputDirectory}`, { 
  cwd: process.cwd() 
});