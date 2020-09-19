const { Command } = require('commander');
const program = new Command();

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

module.exports = new class programConfig {
    version() {
        let package = require('../package.json');
        return package.version
    };
    programOP() {
        program
            .version(this.version)
            .usage('[options]')
            .option('-m, --model <modelName>')
            .option('-f, --fields <fields>')
            .option('-r, --rest')
            .option('-cc --controller <Just controll made>')
            .option('-rr --router <Just route made>')
            .option('-e5 --ECMAScript <ECMAScript 5>')
            .option('-e6 --ECMAScript <ECMAScript 6>')
            .option('-e7 --ECMAScript <ECMAScript 7>')
            .option('-e8 --ECMAScript <ECMAScript 8>')
            .option('-rv --validationRoutes <validation route>')
            .option('-ejs --createEjsFils <pages ejs>')
            .option('-t, --tree <tree>', 'files tree generation grouped by <t>ype or by <m>odule')
            .option('--ts', 'Generating code in TS')
            .parse(process.argv);
    };
    isModelNameParamValid(name) {
        if (!name || name.trim().length === 0) {
            this.consoleError(actionsCLI.ERROR_MODEL_NAME);
            return false;
        }
        return true;
    };
    isFieldTypeParamValid(fieldType) {
        if (!fieldType || fieldType.trim().length === 0) { fieldType = ALLOWED_FIELDS_TYPES[0]; } // default value
        if (ALLOWED_FIELDS_TYPES.indexOf(fieldType) === -1) {
            this.consoleError(actionsCLI.ERROR_TYPE_ARGUMENT);
            return false;
        }
        return true;
    };
    isRestParamValid(param) {
        if (!param || param.trim().length === 0) { param = ALLOWED_REST_ARGUMENT.YES; } // default value
        if (param !== ALLOWED_REST_ARGUMENT.YES && param !== ALLOWED_REST_ARGUMENT.NO) {
            this.consoleError(actionsCLI.ERROR_REST_ARGUMENT);
            return false;
        }
        return true;
    };
    isFileTreeParamValid(param) {
        if (!param || param.trim().length === 0) { param = ALLOWED_FILE_TREE_ARGUMENT.TYPE; } // default value
        if (param !== ALLOWED_FILE_TREE_ARGUMENT.TYPE && param !== ALLOWED_FILE_TREE_ARGUMENT.MODULE) {
            this.consoleError(actionsCLI.ERROR_FILES_TREE_ARGUMENT);
            return false;
        }
        return true;
    };
    isFieldValid(fieldName, fieldType) {
        if (!fieldName || fieldName.trim().length === 0) {
            this.consoleError(CLI_PHRASES.ERROR_FIELD_NAME_REQUIRED);
            return false;
        }
        if (!fieldType || fieldType.trim().length === 0) {
            this.consoleError(CLI_PHRASES.ERROR_FIELD_TYPE_REQUIRED);
            return false;
        }
        if (ALLOWED_FIELDS_TYPES.indexOf(fieldType) === -1) {
            this.consoleError(CLI_PHRASES.ERROR_FIELD_TYPE_INVALID);
            return false;
        }
        return true;
    };
    formatFieldsParamInArray(fields) {
        const arrayFields = fields.split(',');
        const result = [];

        let err = arrayFields.every((field) => {
            let f = field.split(':');

            let fieldName = f[0];
            let fieldType = (f[1] || ALLOWED_FIELDS_TYPES[0]);
            let fieldRef = '';
            let isArray = false;

            if (fieldType === ALLOWED_FIELDS_TYPES[5]) {
                fieldRef = f[2];
                isArray = f[3] === ALLOWED_FIELDS_TYPES[4];
            } else {
                isArray = f[2] === ALLOWED_FIELDS_TYPES[4];
            }

            if (!isFieldValid(fieldName, fieldType)) { return false; }

            result.push({
                name: fieldName,
                type: fieldType,
                isArray: isArray,
                reference: fieldRef
            });

            return true;
        });

        return (!err) ? false : result;
    };
    consoleError(msg) {
        return console.log(cliStyles.red + msg + cliStyles.reset);
    };
}