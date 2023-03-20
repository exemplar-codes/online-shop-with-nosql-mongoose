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
  res.render("admin/add-or-edit-product", {
    myActivePath: "on-admin-page",
    docTitle: "Add product",
    editing: false,
  });
};

const getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;

  res.render("admin/add-or-edit-product", {
    myActivePath: "/admin/edit-product",
    docTitle: "Edit product",
    editing: true,
  });
};

const postAddProduct = async (req, res, next) => {
  const newProduct = new Product(
    req.body.title,
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  await newProduct.save();

  res.redirect("/");
};

const putEditProduct = async (req, res, next) => {
  const newProduct = new Product(req.body.title);
  // await newProduct.save();

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
  getEditProduct,
  putEditProduct,
};
