const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

//Models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

//Registerign VIEW ENGINES: connected ejs templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

//Connecting static css files => public folder
app.use(express.static(path.join(__dirname, 'public')));

//Dummy user
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Define relations between Models:
Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//Creating tables in SQL and listening to the Server
sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    //Manually adding dummy User:
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ userName: 'Ivan', userEmail: 'test@gmaill.com' });
    }
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(() => {
    app.listen(3003);
  })
  .catch(err => {
    console.log(err);
  });
