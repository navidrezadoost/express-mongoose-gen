let ft = require('./fileTools');
let formatTools = require('./formatTools');
let os = require('os');

let

function generateModel(path, modelName, modelFields, generateMethod, ts, cb) {
    let fields = formatTools.getFieldsForModelTemplate(modelFields);
    let schemaName = modelName + 'Schema';

    let extension = (ts) ? 'ts' : 'js';
    let model = ft.loadTemplateSync('model.' + extension);
    model = model.replace(/{modelName}/, modelName);
    model = model.replace(/{schemaName}/g, schemaName);
    model = model.replace(/{fields}/, fields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'models', () => {
            ft.writeFile(path + '/models/' + modelName + 'Model.' + extension, model, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, () => {
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Model.' + extension, model, null, cb);
        });
    }
}


function generateRouter(path, modelName, generateMethod, ts, cb) {
    let extension = (ts) ? 'ts' : 'js';
    let router = ft.loadTemplateSync('router.' + extension);
    router = router.replace(/{controllerName}/g, modelName + 'Controller');

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'routes', () => {
            router = router.replace(/{controllerPath}/g, '\'../controllers/' + modelName + 'Controller.' + extension + '\'');
            ft.writeFile(path + '/routes/' + modelName + 'Routes.' + extension, router, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, () => {
            router = router.replace(/{controllerPath}/g, '\'./' + modelName + 'Controller.' + extension + '\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Routes.' + extension, router, null, cb);
        });
    }
}


function generateController(path, modelName, modelFields, generateMethod, ts, cb) {
    let extension = (ts) ? 'ts' : 'js';
    let controller = ft.loadTemplateSync('controller.' + extension);

    let updateFields = '';
    let createFields = os.EOL;

    modelFields.forEach((f, index, fields) => {
        let field = f.name;

        updateFields += modelName + '.' + field + ' = req.body.' + field + ' ? req.body.' + field + ' : ' +
            modelName + '.' + field + ';';
        updateFields += os.EOL + '\t\t\t';

        createFields += '\t\t\t' + field + ' : req.body.' + field;
        createFields += ((fields.length - 1) > index) ? ',' + os.EOL : '';
    });

    controller = controller.replace(/{modelName}/g, formatTools.capitalizeFirstLetter(modelName) + 'Model');
    controller = controller.replace(/{name}/g, modelName);
    controller = controller.replace(/{pluralName}/g, formatTools.pluralize(modelName));
    controller = controller.replace(/{controllerName}/g, modelName + 'Controller');
    controller = controller.replace(/{createFields}/g, createFields);
    controller = controller.replace(/{updateFields}/g, updateFields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'controllers', () => {
            controller = controller.replace(/{modelPath}/g, '\'../models/' + modelName + 'Model.' + extension + '\'');
            ft.writeFile(path + '/controllers/' + modelName + 'Controller.' + extension, controller, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, () => {
            controller = controller.replace(/{modelPath}/g, '\'./' + modelName + 'Model.' + extension + '\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Controller.' + extension, controller, null, cb);
        });
    }
}

module.exports = {
    generateModel: generateModel,
    generateRouter: generateRouter,
    generateController: generateController
};