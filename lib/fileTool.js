const fs = require('fs');
const path = require('path');
const cliStyles = require('./cliStyle');


function createDirIfIsNotDefined(dirPath, dirName, cb) {
    if (!fs.existsSync(dirPath + '/' + dirName)) {
        fs.mkdirSync(dirPath + '/' + dirName);
        console.info(cliStyles.cyan + '\tcreate' + cliStyles.reset + ': ' + dirPath + '/' + dirName);
    }

    cb();
}

function writeFile(path, contents, mode, cb) {
    fs.writeFile(path, contents, { mode: mode || 0666, encoding: 'utf8' }, (err) => {
        if (err) { throw err; }
        console.info(cliStyles.cyan + '\tcreate' + cliStyles.reset + ': ' + path);
        cb();
    });
}


function loadTemplateSync(name) {
    return fs.readFileSync(path.join(__dirname, '..', 'templates', name), 'utf8');
}

module.exports = {
    createDirIfIsNotDefined: createDirIfIsNotDefined,
    writeFile: writeFile,
    loadTemplateSync: loadTemplateSync
};