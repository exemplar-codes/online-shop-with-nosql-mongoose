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
  const product = await Product.findById(req.params.productId, 10);

  if (!product) {
    next(); // for not found route
    return; // end current middleware
  }

  res.render("shop/product-detail", {
    prod: product,
    docTitle: `${req.params.productId} - ${product.title}`,
    myActivePath: "/products",
  });
};

const cartPage = async (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Cart",
    myActivePath: "/cart",
  });
};

const ordersPage = async (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Orders",
    myActivePath: "/orders",
  });
};

const checkoutPage = async (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    myActivePath: "/checkout",
  });
};

const cartEditPage = async (req, res, next) => {
  const prodId = req.body.productId;
  // 1. This key is same as '<input name />' on the frontend.
  // 2. We are using `urlencoded` middleware plugin to read form body. It's in `app` file right now.

  // res.render("shop/checkout", {
  //   docTitle: "Checkout",
  //   myActivePath: "/checkout",
  // });
  res.redirect("/cart");
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
  ordersPage,
};
