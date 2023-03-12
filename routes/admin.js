const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [{title: "Great book"}];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('add-product', {
    myActivePath: 'on-admin-page',
    docTitle: 'Add product'
  });
});

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
