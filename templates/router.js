const express = require('express');
const router = express.Router();
const {controllerName} = require({ controllerPath });
 
 
router.get('/', {controllerName} .list.bind({controllerName}));
 
router.get('/:id', {controllerName}.show.bind({controllerName}));
 
router.post('/', {controllerName}.create.bind({controllerName}));
 
router.put('/:id', {controllerName}.update.bind({controllerName}));
 
router.delete('/:id', {controllerName}.remove.bind({controllerName}));
 
module.exports = router;
