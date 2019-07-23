var replace = require('replace-in-file');

// ================================================= //
// Replace the version number in environment.prod.ts //
// ================================================= //
var package = require("./package.json");
var buildVersion = package.version + '-' + new Date().toISOString();

const versionOptions = {
    files: 'src/environments/environment.prod.ts',
    from: /version: '(.*)'/g,
    to: "version: '" + buildVersion + "'",
    allowEmptyPaths: false,
};

try {
    let changedFiles = replace.sync(versionOptions);
    if (changedFiles == 0) {
        throw "Please make sure that file '" + options.files + "' has \"version: ''\"";
    }
    console.log('Build version set: ' + buildVersion);
} catch (error) {
    console.error('Error occurred:', error);
    throw error;
}

// ========================================== //
// Replace the api key in environment.prod.ts //
// ========================================== //
var firebaseConfig = require("./firebase-config.json");
var apiKey = firebaseConfig.apiKey;
const apiKeyOptions = {
    files: 'src/environments/environment.prod.ts',
    from: /apiKey: '(.*)'/g,
    to: "apiKey: '" + apiKey + "'",
    allowEmptyPaths: false,
};
try {
    let changedFiles = replace.sync(apiKeyOptions);
    if (changedFiles == 0) {
        throw "Please make sure that file '" + options.files + "' has \"apiKey: ''\"";
    }
    console.log('Api Key set: ' + apiKey);
} catch (error) {
    console.error('Error occurred:', error);
    throw error;
}