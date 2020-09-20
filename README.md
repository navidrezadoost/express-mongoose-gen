
# express-mongoose-gen

This package of models receives your database and structures your project with architecture MVC as REST controller and Express router code generator for Express.js 4.0.17 application.
Full support for type script and defining files as base class

```
Note that the package must be installed globally on your system
```

## Installation
```bash
$ npm install -g express-mongoose-gen
```

## Usage
```bash
$ mongoose-gen -m user -f firstName:number,lastName:string -r
        create: ./models/userdModel.js
        create: ./routes/userdRoutes.js
        create: ./controllers/userdController.js
```

##### Options

  - `-m, --model <modelName>` - the model name.
  - `-f, --fields  <fields>` - the fields (name1:type,name2:type).
  - `-r, --rest` - enable generation REST.
  - `-t, --tree <tree>`        files tree generation grouped by (t)ype or by (m)odule

##### Available types
  - string
  - number
  - date
  - boolean
  - array
  - objectId

### Interactive mode
```bash
$ mongoose-gen
Model Name : user
Available types : string, number, date, boolean, array
Field Name (press <return> to stop adding fields) : door
Field Type [string] : number
Field Name (press <return> to stop adding fields) : color
Field Type [string] : 
Field Name (press <return> to stop adding fields) : owner
Field Type [string] : objectId
Reference (model name referred by the objectId field) : User
Field Name (press <return> to stop adding fields) : 
Generate Rest (yes/no) ? [yes] : 
Files tree generation grouped by Type or by Module (t/m) ? [t] : 
        create: ./models/userModel.js
        create: ./routes/usersRoutes.js
        create: ./controllers/userController.js
```

## Package output in your project
### Model

models/userModel.js :
```javascript
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
	firstName : { type : String },
	lastName : { type : Number },
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps : true});

module.exports = mongoose.model('user', userSchema);
```

### Router
routes/userRoutes.js :
```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');


router.get('/', userController.list.bind(userController));

router.get('/:id', userController.show.bind(userController));

router.post('/', userController.create.bind(userController));

router.put('/:id', userController.update.bind(userController));

router.delete('/:id', userController.remove.bind(userController));

module.exports = router;

```

### Controller
controllers/userController.js :
```javascript
const userModel = require({modelPath});
 
 
module.exports = new class user {
   list(req , res) {
       userModel.find({} , (err, user) => {
           if (err) {
               return res.status(500).json({
                   message: 'Error when getting user.',
                   error: err
               });
           }
           return res.status(200).json(user);
       });
   };
   show(req , res) {
       userModel.findById(req.params.id,  (err, user) => {
           if (err) {
               return res.status(500).json({
                   message: 'Error when getting user.',
                   error: err
               });
           }
           if (!user) {
               return res.status(404).json({
                   message: 'No such user'
               });
           }
           return res.status(200).json(user);
       });
   };
   create(req , res) {
       let user = new userModel({{createFields}
       });
 
       user.save((err, user) =>  {
           if (err) {
               return res.status(500).json({
                   message: 'Error when creating user',
                   error: err
               });
           }
           return res.status(201).json(user);
       });
   };
   update(req , res) {
       userModel.findById(req.params.id ,  (err, user) =>  {
           if (err) {
               return res.status(500).json({
                   message: 'Error when getting user',
                   error: err
               });
           }
           if (!user) {
               return res.status(404).json({
                   message: 'No such user'
               });
           }
           {updateFields}
           user.save((err, user) => {
               if (err) {
                   return res.status(500).json({
                       message: 'Error when updating user.',
                       error: err
                   });
               }
               return res.json(user);
           });
       });
   };
   remove(req , res) {
       userModel.findByIdAndRemove(req.params.id,  (err, user) =>  {
           if (err) {
               return res.status(500).json({
                   message: 'Error when deleting the user.',
                   error: err
               });
           }
           return res.status(204).json();
       });
   };
};
```

### With files tree generation by module
```bash
Files tree generation grouped by Type or by Module (t/m) ? [t] : m
        create: ./user
        create: ./user/userModel.js
        create: ./user/userController.js
        create: ./user/userRoutes.js
```

You then only have to add router in app.js file and MongoDB connection whit Mongoose.
app.js :
```javascript
const routes = require('./routes/index');
const users = require('./routes/userRoutes');
 ...

app.use('/', routes);
app.use('/users', users);
 ...
 
```

## Licence

Copyright (c) 2020 Navidrezadoost
Licensed under the [MIT license](LICENSE).