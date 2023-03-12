const Product = require("../models/Product");

const getAddProduct = (req, res, next) => {
  res.render("add-product", {
    myActivePath: "on-admin-page",
    docTitle: "Add product",
  });
};

const postAddProduct = (req, res, next) => {
  const newProduct = new Product(req.body.title);
  newProduct.save();

  res.redirect("/");
};

const deleteAllProducts = (req, res, next) => {
  const products = Product.fetchAll(); //
  while (products.length) products.pop(); // works, coz pass by reference
  res.redirect("/");
};

const getProducts = (req, res, next) => {
  const products = Product.fetchAll();

  res.render("shop", {
    prods: products,
    docTitle: "My shop",
    myActivePath: "shop-page",
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  deleteAllProducts,
  getProducts,
};
