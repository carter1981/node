const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const dbConfig = require('./config');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONOGDB_URI = `mongodb+srv://${dbConfig.dbUserName}:${dbConfig.dbPassword}@cluster0.6a3i8.mongodb.net/shop?w=majority`;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const app = express();

const store = new MongoDBStore({
  uri: MONOGDB_URI,
  collection: 'sessions'
});

//Defining csrf protection:
const csrfProtection = csrf();

//Registering VIEW ENGINES: connected ejs templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

//Connecting static css files => public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store,
}));

//Initializing csrf protection:
app.use(csrfProtection);

//Initializin flash sessions for storing error messages:
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONOGDB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => {
  app.listen(3003);
}).catch(err => console.log(err));


