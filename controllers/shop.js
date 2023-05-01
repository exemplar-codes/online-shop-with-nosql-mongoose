const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const { extractKeys } = require("../util/common");

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
    return extractKeys(
      prod,
      [
        "id",
        "title",
        "price",
        "imageUrl",
        "description",
        "contentItem",
        "cartItem.quantity",
      ],
      {
        shortKeys: true,
        removeAssociatedColumns: false,
      }
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
  const user = req.user;
  const cart = await user.getCart();
  const prodId = req.body.productId;

  const productExists = !!(await cart.getProducts({ where: { id: prodId } }));
  if (!productExists) return next();

  // product exists
  const [cartItem = null] = await cart.getCartItems({
    where: { productId: prodId },
  });

  if (req.query.add) {
    // default is add
    let newCartItem = null;
    if (!cartItem) {
      newCartItem = await cart.createCartItem({ quantity: 0 });
      await newCartItem.setProduct(prodId);
    }
    (cartItem || newCartItem).quantity += 1;
    await (cartItem || newCartItem)?.save();
  } else if (req.query.decrement) {
    if (!cartItem) return next(); // 404

    cartItem.quantity -= 1;
    await cartItem.save();
  } else if (req.query.delete) await cartItem?.destroy(); // idempotent
  else return next();

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
