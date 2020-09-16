const os = require('os');

const referenceType = require('../templates/fieldReferenceType');
const allowedFieldsTypes = {
    'string': String,
    'number': Number,
    'date': Date,
    'boolean': Boolean,
    'array': Array,
    'objectId': referenceType
};


function getFieldsForModelTemplate(fields) {
    let lg = fields.length - 1;

    let modelFields = '{' + os.EOL;
    fields.forEach((field, index, array) => {
        modelFields += '\t\'' + field.name + '\' : ' + (field.isArray ? '[' : '') + (allowedFieldsTypes[field.type]).name + (field.isArray ? ']' : '');
        modelFields += (lg > index) ? ',' + os.EOL : os.EOL;

        if (field.reference) {
            modelFields = modelFields.replace(/{ref}/, field.reference);
        }
    });
    modelFields += '}';

    return modelFields;
};


function capitalizeFirstLetter(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};


function pluralize(word) {
    return word + 's';
};

module.exports = {
    getFieldsForModelTemplate: getFieldsForModelTemplate,
    pluralize: pluralize,
    capitalizeFirstLetter: capitalizeFirstLetter
};