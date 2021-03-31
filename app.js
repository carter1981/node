const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dbConfig = require('./config');

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

//Registering VIEW ENGINES: connected ejs templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

//Connecting static css files => public folder
app.use(express.static(path.join(__dirname, 'public')));

//Dummy user
app.use((req, res, next) => {
  User.findById('6062e142a3a3462d3574c603')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(`mongodb+srv://${dbConfig.dbUserName}:${dbConfig.dbPassword}@cluster0.6a3i8.mongodb.net/shop?retryWrites=true&w=majority`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => {
  User.findOne()
    .then(user => {
      if (!user) {
        const user = new User({
          name: 'Marvin',
          email: 'test@test.com',
          cart: {
            items: [],
          }
        });
        user.save();
      }
    });

  app.listen(3003);
}).catch(err => console.log(err));


