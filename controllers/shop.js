const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

const indexPage = async (req, res, next) => {
  res.render("shop/index", {
    docTitle: "My shop",
    myActivePath: "shop-page",
  });
};

const getProducts = async (req, res, next) => {
  const products = await Product.findAll();

  res.render("shop/product-list", {
    prods: products,
    docTitle: "Products",
    myActivePath: "/products",
  });
};

const getProduct = async (req, res, next) => {
  const product = await Product.findByPk(req.params.productId);

  if (!product) {
    next(); // for not found route
    return; // end current middleware
  }

  res.render("shop/product-detail", {
    prod: product,
    docTitle: `${product.id} - ${product.title}`,
    myActivePath: "/products",
  });
};

const cartPage = async (req, res, next) => {
  const user = req.user;
  const cart = await user.getCart(); // have to 'get' it since it's an association, not owned column
  let products = await cart.getProducts({
    attributes: ["id", "title", "price", "imageUrl", "description"],
    includes: {
      model: [CartItem],
      attributes: ["quantity"],
    },
    raw: true,
  });

  products = products.map((prod) => {
    const desiredKeys = [
      "id",
      "title",
      "price",
      "imageUrl",
      "description",
      "contentItem",
      "cartItem.quantity",
    ];
    return Object.entries(prod).reduce(
      (accum, [k, v]) =>
        desiredKeys.includes(k)
          ? { ...accum, [k.split(".").at(-1)]: [v] }
          : accum,
      {}
    );
  });

  const totalPrice = products.reduce((accum, prod) => accum + +prod.price, 0);

  res.render("shop/cart", {
    docTitle: "Cart",
    myActivePath: "/cart",
    totalPrice,
    products: products,
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

const postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const { price: productPrice } = await Product.findByPk(prodId);

  if (req.query.decrement) {
    await Cart.addProduct(prodId, productPrice, -1);
    res.redirect("/cart");
    return;
  }

  if (req.query.delete) {
    const productDeleteSuccessful = await Cart.deleteProduct(
      prodId,
      productPrice
    );
    if (!productDeleteSuccessful) {
      res.status(402).redirect("/cart");
    } else {
      res.redirect("/cart");
    }

    return;
  }

  // default is add
  await Cart.addProduct(prodId, productPrice);
  res.redirect("/cart");
  return;
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
  postCart,
  checkoutEditPage,
  ordersPage,
};
