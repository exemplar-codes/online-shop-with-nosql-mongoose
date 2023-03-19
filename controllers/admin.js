const Product = require("../models/Product");

const getAdminProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  const productsByAdmin = products.filter(() => true);
  // add owned by a particular admin filter, later

  res.render("admin/products", {
    prods: productsByAdmin,
    docTitle: "Admin products",
    myActivePath: "/admin/products",
  });
};

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

module.exports = {
  getAdminProducts,
  getAddProduct,
  postAddProduct,
  deleteAllProducts,
};
