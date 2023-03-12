const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products')

const products = [{title: "Great book"}];

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

// /admin/add-product => POST
router.post('/delete-all-products', (req, res, next) => {
  while (products.length)
    products.pop();
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
