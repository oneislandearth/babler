// Import the required node modules
const fs = require('fs');
const path = require('path');

// Define a variable for the jsconfig (singleton)
let jsconfig;

// Read the jsconfig file
const readJSConfig = () => {

  // Check that the jsconfig file has not been read
  if (jsconfig == null) {

    // Define the path for the jsconfig file from the project directory
    jsconfig = path.resolve(process.cwd(), 'jsconfig.json');

    // Check if the jsconfig file exists
    if (fs.existsSync(jsconfig)) {

      // Update jsconfig to be the file parsed as JSON
      jsconfig = JSON.parse(fs.readFileSync(jsconfig));

    } else {

      // Update jsconfig to be false
      jsconfig = false;
    }
  }

  // Return the jsconfig (or false)
  return jsconfig;
}

// Find the source directory in the project
const findSourceDirectory = () => {

  // Read the jsconfig file in the project directory
  const jsconfig = readJSConfig();

  // Return the default if there is no jsconfig base url
  if (!(jsconfig && jsconfig.compilerOptions && jsconfig.compilerOptions.baseUrl)) return path.resolve(process.cwd(), 'src');
      
  // Return the source directory
  return path.resolve(process.cwd(), jsconfig.compilerOptions.baseUrl);
}

// Find the aliases from the jsconfig file
const findAliases = () => {

  // Define the source directory
  let source = findSourceDirectory();

  // Define the list of aliases
  const aliases = {

    // Add the source project directory
    '^': source
  };

  // Read the jsconfig file
  const jsconfig = readJSConfig();

  // Check if there are any paths set in the jsconfig
  if (jsconfig && jsconfig.compilerOptions && jsconfig.compilerOptions.paths) {

    // Iterate through the paths in the jsconfig
    for (let [alias, value] of Object.entries(jsconfig.compilerOptions.paths)) {

      // Replace the astrix in the alias
      alias = alias.replace('/*', '').replace('*', '');

      // Add the alias as an absolute path
      aliases[alias] = path.resolve(source, value[0]);
    }
  }

  // Return the aliases
  return aliases;
}

// Find the directory path from a filepath
const findDirectoryPath = (filepath) => {

    // Split the filepath using the seperator
    const splits = filepath.split(path.sep);

    // Iterate through the filepath until we have a directory
    for (let i = (splits.length - 1); i > -1; i--) {

      // Define the path from the splits
      const splitpath = splits.slice(0, i).join(path.sep);

      // Return if the filepath is a directory
      if (fs.lstatSync(splitpath).isDirectory()) return splitpath;
    }
}

// Find the relative path from a to b
const findRelativePath = (a, b) => { 

    // Find the relative path to the source
    let relative = path.relative(a, b);

    // Check if there is relative start to the path add one
    if (relative[0] != '.') relative = `.${path.sep}${relative}`;

    // Return the relative path
    return relative;
}

// Remove a directory recursively
const removeDirectoryRecursive = (directory) => {

  // Check if the directory exists as a directory
  if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) return;
  
  // Read the current folder
  for (let resource of fs.readdirSync(directory)) {
    
    // Update the resource to form the full path
    resource = path.join(directory, resource);

    // Check the resource exists
    if (fs.existsSync(resource)) {

      // If the resource exists as a file
      if (!fs.lstatSync(resource).isDirectory()) {
        
        // Remove the file and continue to the next iteration of the loop
        fs.unlinkSync(resource);
        continue;
      }
      
      // The resource is a directory so remove recursively
      removeDirectoryRecursive(resource);
    }
  }

  // Remove the current directory
  fs.rmdirSync(directory);
}

// Copy a resource file to the project folder
const copyResource = (filename, output = filename) => {

  // Resolve the paths for the file
  const package = path.resolve(__dirname, '../resources/', filename);
  const project = path.resolve(process.env.INIT_CWD, output);

  // Check that the file does not exists in the project folder
  if (!fs.existsSync(project)) {

    // Attempt to copy the file to the project folder
    try { 

      // Write the file to the project folder
      fs.writeFileSync(project, fs.readFileSync(package));

    } catch (e) {}
  }
}

// Add the prepublishOnly hook to the package.json
const addPrepublishOnlyScript = () => {

  // Set the updated flag to false
  let updated = false;

  // Resolve the path for package.json
  const packagePath = path.resolve(process.env.INIT_CWD, 'package.json');

  // Read the package.json as JSON
  const packageData = JSON.parse(fs.readFileSync(packagePath));

  // Check there are no scripts and add the default value
  if (!packageData.scripts) packageData.scripts = {};

  // Check there is no prepublishOnly script and add the prepublishOnly script
  if (!packageData.scripts.prepublishOnly) {
    
    // Add the prepublishOnly script
    packageData.scripts.prepublishOnly = 'oneisland-babler dist';

    // Update the updated flag
    updated = true;
  }

  // Return false if update
  if (!updated) return false;

  // Save the package.json
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));

  // Return true
  return true;
}

// Export the module functions
module.exports = {
  readJSConfig,
  findSourceDirectory,
  findAliases,
  findDirectoryPath,
  findRelativePath,
  removeDirectoryRecursive,
  addPrepublishOnlyScript,
  copyResource
}