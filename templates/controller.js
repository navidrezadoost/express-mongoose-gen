const {modelName} = require({modelPath});


module.exports = {
    list:  (req, res) =>  {
        {modelName}.find((err, {pluralName}) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}.',
                    error: err
                });
            }
            return res.json({pluralName});
        });
    },
    show:  (req, res) =>  {
        {modelName}.findById(req.params.id,  (err, {name}) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}.',
                    error: err
                });
            }
            if (!{name}) {
                return res.status(404).json({
                    message: 'No such {name}'
                });
            }
            return res.status(200).json({name});
        });
    },
    create:  (req, res) =>  {
        let {name} = new {modelName}({{createFields}
        });

        {name}.save((err, {name}) =>  {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating {name}',
                    error: err
                });
            }
            return res.status(201).json({name});
        });
    },
    update:  (req, res) =>  {
        {modelName}.findById(req.params.id ,  (err, {name}) =>  {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}',
                    error: err
                });
            }
            if (!{name}) {
                return res.status(404).json({
                    message: 'No such {name}'
                });
            }
            {updateFields}
            {name}.save((err, {name}) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating {name}.',
                        error: err
                    });
                }

                return res.json({name});
            });
        });
    },
    remove:  (req, res) =>  {
        {modelName}.findByIdAndRemove(req.params.id,  (err, {name}) =>  {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the {name}.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
