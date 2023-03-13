const Product = require("../models/Product");

const getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    myActivePath: "on-admin-page",
    docTitle: "Add product",
  });
};

const postAddProduct = async (req, res, next) => {
  const newProduct = new Product(req.body.title);
  await newProduct.save();

  res.redirect("/");
};

const deleteAllProducts = async (req, res, next) => {
  await Product.deleteAll(); //

  res.redirect("/");
};

const getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("shop/product-list", {
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
