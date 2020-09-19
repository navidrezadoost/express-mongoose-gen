const readline = require('readline');
const async = require('async');
const generators = require('../lib/generator');
const cliStyles = require('../lib/cliStyle');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//local mudule
const config = require('./config')

const ALLOWED_FIELDS_TYPES = ['string', 'number', 'date', 'boolean', 'array', 'objectId'];
const ALLOWED_REST_ARGUMENT = { 'YES': 'yes', 'NO': 'no' };
const ALLOWED_FILE_TREE_ARGUMENT = { 'TYPE': 't', 'MODULE': 'm' };
const actionsCLI = {
    AVAILABLE_TYPE: 'Available types : string, number, date, boolean, array, objectId',
    QUESTION_MODEL_NAME: 'Model Name : ',
    QUESTION_FIELD_NAME: 'Field Name (press <return> to stop adding fields) : ',
    QUESTION_FIELD_TYPE: 'Field Type [string] : ',
    QUESTION_FIELD_REF: 'Reference (model name referred by the objectId field) : ',
    QUESTION_GENERATE_REST: 'Generate Rest (yes/no) ? [yes] : ',
    QUESTION_FILES_TREE: 'Files tree generation grouped by Type or by Module (t/m) ? [t] : ',
    ERROR_MODEL_NAME: 'Argument required : Model name',
    ERROR_TYPE_ARGUMENT: 'Invalid Argument : Field type is not allowed',
    ERROR_REST_ARGUMENT: 'Argument invalid : rest',
    ERROR_FILES_TREE_ARGUMENT: 'Argument invalid : file tree generation',
    ERROR_FIELD_REQUIRED: 'Argument required : fields',
    ERROR_FIELD_NAME_REQUIRED: 'Argument required : Field Name',
    ERROR_FIELD_TYPE_REQUIRED: 'Argument required : Field type',
    ERROR_FIELD_TYPE_INVALID: 'Invalid Argument : Field type is not allowed'
};


// CLI
config.programOP



// Main program
    ((path) => {
    let ts = !!(config.programOP.ts);
    if (config.programOP.model || config.programOP.fields) {
        runNonInteractiveMode(path, ts);
    } else {
        runInteractiveMode(path, ts);
    }
})('.');


function runInteractiveMode(path, ts) {
    async.series({
            name: (cb) => {
                askQuestion(actionsCLI.QUESTION_MODEL_NAME, config.isModelNameParamValid, (name) => {
                    console.log(cliStyles.green + actionsCLI.AVAILABLE_TYPE + cliStyles.reset);
                    cb(null, name);
                });
            },
            fields: (cb) => {
                const exit = false;
                const fields = [];
                const currentField = {};

                async.whilst(
                    () => { return !exit; },
                    (cb) => {
                        async.series({
                                name: (cb) => {
                                    askQuestion(actionsCLI.QUESTION_FIELD_NAME,
                                        null,
                                        (fieldName) => {
                                            if (fieldName.trim().length === 0) {
                                                exit = true;
                                            }
                                            cb(exit, fieldName);
                                        }
                                    );
                                },
                                type: (cb) => {
                                    askQuestion(actionsCLI.QUESTION_FIELD_TYPE, config.isFieldTypeParamValid,
                                        (fieldType) => {
                                            currentField.type = (fieldType.trim().length === 0) ? 'string' : fieldType;
                                            cb(null, currentField.type);
                                        }
                                    );
                                },
                                reference: (cb) => {
                                    if (currentField.type === 'objectId') {
                                        askQuestion(actionsCLI.QUESTION_FIELD_REF, null, (referenceName) => {
                                            referenceName = (referenceName.trim().length === 0) ?
                                                'INSERT_YOUR_REFERENCE_NAME_HERE' :
                                                referenceName;
                                            cb(null, referenceName);
                                        });
                                    } else {
                                        cb(null, null);
                                    }
                                }
                            },
                            (err, results) => {
                                if (!err) {
                                    fields.push(results);
                                }
                                cb();
                            });
                    },
                    (err, results) => {
                        cb(null, fields);
                    });
            },
            rest: (cb) => {
                askQuestion(actionsCLI.QUESTION_GENERATE_REST, config.isRestParamValid, (rest) => {
                    rest = (rest.trim().length === 0) ? 'yes' : rest;
                    cb(null, rest);
                });
            },
            generateMethod: (cb) => {
                askQuestion(actionsCLI.QUESTION_FILES_TREE, config.isFileTreeParamValid, (generateMethod) => {
                    generateMethod = (generateMethod.trim().length === 0) ? 't' : generateMethod;
                    cb(null, generateMethod);
                });
            }
        },
        (err, results) => {
            if (err) {
                return closeProgram();
            }

            async.parallel([
                    (cb) => {
                        generators.generateModel(path, results.name, results.fields, results.generateMethod, ts, cb);
                    },
                    (cb) => {
                        if (results.rest !== 'yes') { return cb(); }
                        generators.generateRouter(path, results.name, results.generateMethod, ts, cb);
                    },
                    (cb) => {
                        if (results.rest !== 'yes') { return cb(); }
                        generators.generateController(path, results.name, results.fields, results.generateMethod, ts, cb);
                    }
                ],
                function(err, results) {
                    closeProgram();
                }
            );
        }
    );
}


function askQuestion(question, validate, callback) {
    rl.question(question, (answer) => {
        if (validate) {
            if (!validate(answer)) {
                askQuestion(question, validate, callback);
                return;
            }
        }
        callback(answer);
    });
};

function closeProgram() {
    rl.close();
    process.exit();
};