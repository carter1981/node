const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const {
    title,
    imageUrl,
    description,
    price
  } = req.body;
  console.log(res.user)
//Adding relation with User and Save to Db:
  req.user.createProduct({
    title,
    price,
    imageUrl,
    description,
    userId: req.user.id,
  })
    .then(result => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;

  if (!editMode) {
    res.redirect('/');
  }
  req.user
    .getProducts({ where: { id: prodId } })
    .then((products) => {
      const product = products[0];

      if (!product) {
        res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const {
    productId,
    title,
    imageUrl,
    description,
    price,
  } = req.body;

  Product
    .findByPk(productId)
    .then(product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      //First Saving to the database:
      return product.save();
    })
    .then(() => {
      //Then redirect:
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  //Delete product in DB:
  Product
    .findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};