const { modelName } = require({ modelPath });


module.exports = new class { modelName } {
    list(req, res) {
        { modelName }.find((err, { pluralName }) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}.',
                    status: res.statusCode,
                    error: err
                });
            }
            res.status(200).json({ pluralName });
        })
    };
    show(req, res) {
        { modelName }.findById(req.params.id, (err, { name }) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}.',
                    status: res.statusCode,
                    error: err
                });
            }
            if (!{ name }) {
                return res.status(404).json({
                    message: 'No such {name}',
                    status: res.statusCode
                });
            }
            res.status(200).json({ name });
        })
    };
    create(req, res) {
        let { name } = new { modelName }({
            { createFields }
        }); { name }.save()
            .then({ name } => res.status(200).json({ name }))
            .catch(err => res.status(500).json({
                message: 'Error when create {name}.',
                status: res.statusCode,
                error: err
            }))
    };
    update(req, res) {
        { modelName }.findByIdAndUpdate(req.params.id, { updateFields }, (err, { name }) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}',
                    status: res.statusCode,
                    error: err
                });
            }
            if (!{ name }) {
                return res.status(404).json({
                    message: 'No such {name}',
                    status: res.statusCode
                });
            }
            return res.status(200).json({ name });
        });
    };
    remove(req, res) {
        { modelName }.findByIdAndRemove(req.params.id, (err, { name }) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the {name}.',
                    error: err
                });
            }
            res.status(200).json('item { name } removed!');
        });
    }
}