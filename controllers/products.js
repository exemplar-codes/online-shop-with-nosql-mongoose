const getAddProduct = (req, res, next) => {
  res.render("add-product", {
    myActivePath: "on-admin-page",
    docTitle: "Add product",
  });
};

module.exports = {
  getAddProduct,
};
