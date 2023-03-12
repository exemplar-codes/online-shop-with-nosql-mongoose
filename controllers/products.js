const products = [{ title: "Great book" }];

const getAddProduct = (req, res, next) => {
  res.render("add-product", {
    myActivePath: "on-admin-page",
    docTitle: "Add product",
  });
};

const postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

const deleteAllProducts = (req, res, next) => {
  while (products.length) products.pop();
  res.redirect("/");
};

const getProducts =(req, res, next) => {
  res.render('shop', {
    prods: products,
    docTitle: 'My shop',
    myActivePath: 'shop-page'
  });
}

module.exports = {
  getAddProduct,
  postAddProduct,
  deleteAllProducts,
  getProducts,
  products,
};
