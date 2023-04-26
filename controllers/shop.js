const Cart = require("../models/Cart");
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
  const cart = await Cart.getCart();
  const allProducts = await Product.findAll();

  let totalPrice = 0;
  // filter out products in cart that are present in allProducts
  cart.products = cart.products
    .map((cartProduct) => {
      let existingProduct =
        allProducts.find((item) => item.id == cartProduct.id) ?? null;

      if (existingProduct) {
        existingProduct = {
          ...existingProduct,
          quantity: cartProduct.quantity,
        };
      }

      return existingProduct;
    })
    .filter((cartProduct) => {
      if (cartProduct) {
        totalPrice += cartProduct.price * cartProduct.quantity;
      }

      return cartProduct;
    });

  res.render("shop/cart", {
    docTitle: "Cart",
    myActivePath: "/cart",
    totalPrice,
    products: cart.products,
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
