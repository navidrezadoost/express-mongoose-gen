const express = require('express');
const router = express.Router();
const { controllerName } = require({ controllerPath });


router.get('/', { controllerName }.list);

router.get('/:id', { controllerName }.show);

router.post('/', { controllerName }.create);

router.put('/:id', { controllerName }.update);

router.delete('/:id', { controllerName }.remove);

module.exports = router;