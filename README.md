
# express-mongoose-gen

It’s a mongoose model, REST controller and Express router code generator for Express.js 4.17.1 application.

## Installation
```bash
$ npm install -g express-mongoose-gen
```

## How to call and use it
Generates a Mongoose model, a REST controller and Express router :
```bash
$ mongoose-gen -m user -f firstName:string,lastName -r
        create: ./models/cardModel.js
        create: ./routes/cardRoutes.js
        create: ./controllers/cardController.js
```

##### Options

  - `-m, --model <modelName>` - Enter the heart you want.
  - `-f, --fields  <fields>` - Enter the names of your fields (firstName:type,lastName:type).
  - `-r, --rest` - enable generation REST.
  - `-t, --tree <tree>`        files tree generation grouped by (t)ype or by (m)odule

##### Types supported in this version include
  - string
  - number
  - date
  - boolean
  - array
  - objectId


### Input commands from bash
```
$ mongoose-gen
Model Name : car
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
        create: ./models/carModel.js
        create: ./routes/carsRoutes.js
        create: ./controllers/carController.js
```

## Rendering
### Model
models/userModel.js :
```javascript
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
	"firstName" : String,
	"lastName" : String,
    "addResses" : {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }
});

module.exports = mongoose.model('user', userSchema);
```

### Route are made this way
routers/userRoutes.js :
```javascript
var express = require('express');
var router = express.Router();
var carController = require('../controllers/carController.js');


 //GET
router.get('/', carController.list);

//GET
router.get('/:id', carController.show);

//POST
router.post('/', carController.create);

//PUT
router.put('/:id', carController.update);

//DELETE
router.delete('/:id', carController.remove);

module.exports = router;

```

### Controller
controllers/carController.js :
```javascript
var carModel = require('../models/carModel.js');

/**
 * carController.js
 *
 * @description :: Server-side logic for managing cars.
 */
module.exports = {

    /**
     * carController.list()
     */
    list: function(req, res) {
        carModel.find(function(err, cars){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting car.'
                });
            }
            return res.json(cars);
        });
    },

    /**
     * carController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        carModel.findOne({_id: id}, function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting car.'
                });
            }
            if(!car) {
                return res.status(404).json({
                    message: 'No such car'
                });
            }
            return res.json(car);
        });
    },

    /**
     * carController.create()
     */
    create: function(req, res) {
        var car = new carModel({
			color : req.body.color,
			door : req.body.door
        });

        car.save(function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving car',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: car._id
            });
        });
    },

    /**
     * carController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        carModel.findOne({_id: id}, function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving car',
                    error: err
                });
            }
            if(!car) {
                return res.status(404).json({
                    message: 'No such car'
                });
            }

            car.color =  req.body.color ? req.body.color : car.color;
			car.door =  req.body.door ? req.body.door : car.door;
			
            car.save(function(err, car){
                if(err) {
                    return res.status(500).json({
                        message: 'Error getting car.'
                    });
                }
                if(!car) {
                    return res.status(404).json({
                        message: 'No such car'
                    });
                }
                return res.json(car);
            });
        });
    },

    /**
     * carController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        carModel.findByIdAndRemove(id, function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting car.'
                });
            }
            return res.json(car);
        });
    }
};
```

### With files tree generation by module
```bash
Files tree generation grouped by Type or by Module (t/m) ? [t] : m
        create: ./car
        create: ./car/carModel.js
        create: ./car/carController.js
        create: ./car/carRoutes.js
```

You then only have to add router in app.js file and MongoDB connection whit Mongoose.
app.js :
```javascript
var routes = require('./routes/index');
var cars = require('./routes/carRoutes');
 ...

app.use('/', routes);
app.use('/cars', cars);
 ...
 
```


Copyright (c) 2020 Navid rezadoost
