const Product = require("../models/Product");

const indexPage = async (req, res, next) => {
  res.render("shop/index", {
    docTitle: "My shop",
    myActivePath: "shop-page",
  });
};

const getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("shop/product-list", {
    prods: products,
    docTitle: "Products",
    myActivePath: "/products",
  });
};

const getProduct = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("shop/product-list", {
    prods: [products[0]],
    docTitle: "Some product",
    myActivePath: "/products-detail",
  });
};

const cartPage = async (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Cart",
    myActivePath: "/cart",
  });
};

const checkoutPage = async (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    myActivePath: "/checkout",
  });
};

const cartEditPage = async (req, res, next) => {
  // res.render("shop/checkout", {
  //   docTitle: "Checkout",
  //   myActivePath: "/checkout",
  // });
  res.redirect("/");
};

const checkoutEditPage = async (req, res, next) => {
  res.redirect("/");
};

module.exports = {
  indexPage,
  getProducts,
  cartPage,
  checkoutPage,
  getProduct,
  cartEditPage,
  checkoutEditPage,
};
