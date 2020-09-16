
# express-mongoose-gen

This package of models receives your database and structures your project with architecture MVC as REST controller and Express router code generator for Express.js 4.0.17 application.

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
});

module.exports = mongoose.model('user', userSchema);
```

### Router
routes/userRoutes.js :
```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

/*
 * GET
 */
router.get('/', userController.list);

/*
 * GET
 */
router.get('/:id', userController.show);

/*
 * POST
 */
router.post('/', userController.create);

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;

```

### Controller
controllers/userController.js :
```javascript
const userModel = require('../models/userModel.js');


module.exports = new class userController {
    list(req, res) {
        userModel.find((err, users) => {
            if(err) {
                return res.status(500).json({
                    message: 'Error getting user.'
                });
            }
             res.status(200).json(users);
        });
    };
    show(req, res) {
        userModel.findById(req.params.id, (err, user) => {
            if(err) {
                return res.status(500).json({
                    message: 'Error getting user.'
                });
            }
            if(!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
             res.status(200).json(user);
        });
    };
    create(req, res) {
        let user = new userModel({
			firstName : req.body.firstName,
			lastName : req.body.lastName
        });

        user.save()
            res.status(200).json('user created!')
    };
    update(req, res) {
        userModel.findByIdAndUpdate(req.params.id, {
user.firstName : req.body.firstName ,
user.lastName :  req.body.lastName
        } ,(err, user) => {
            if(err) {
                return res.status(500).json({
                    message: 'Error saving user',
                    error: err
                });
            }
            if(!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            res.status(200).json('user data updated!')
        });
    };
    remove(req, res) {
        userModel.findByIdAndDelete(req.params.id, (err, user) => {
            if(err) {
                return res.status(500).json({
                    message: 'Error getting user.'
                });
            }
             res.status(200).json(user);
        });
    }
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
