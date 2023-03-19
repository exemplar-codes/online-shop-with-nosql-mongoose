const Product = require("../models/Product");

const getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("shop/product-list", {
    prods: products,
    docTitle: "My shop",
    myActivePath: "shop-page",
  });
};

module.exports = {
  getProducts,
};
