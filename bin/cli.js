#!/usr/bin/env node

// Import the required node modules
const path = require('path');
const { execSync } = require('child_process');

// Import the required utils
const { findSourceDirectory, removeDirectoryRecursive } = require('../lib/utils');

// Work out the output directory from the cli input or fallback to 'dist'
const outputDirectory = ((process.argv[2]) ? process.argv[2] : 'dist');

// Remove the current output directory
// removeDirectoryRecursive(path.resolve(process.cwd(), outputDirectory));
execSync(`rm -rf ${outputDirectory}`, { 
  cwd: process.cwd(),
  stdio: 'inherit'
});

// Run the files in the source directory through babel
execSync(`babel ${findSourceDirectory()} -d ${outputDirectory} --source-maps`, { 
  cwd: process.cwd(),
  stdio: 'inherit'
});