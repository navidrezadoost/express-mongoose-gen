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
