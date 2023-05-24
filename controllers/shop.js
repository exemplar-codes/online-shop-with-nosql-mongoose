const Product = require("../models/Product");
// const CartItem = require("../models/CartItem");
// const Order = require("../models/Order");
// const OrderItem = require("../models/CartItem");
const { extractKeys, dateToTimeStampString } = require("../util/common");

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
  const product = await Product.findById(req.params.productId);

  if (!product) {
    next(); // for not found route
    return; // end current middleware
  }

  res.render("shop/product-detail", {
    prod: product,
    docTitle: `${product.title} - ${product._id || product.id}`,
    myActivePath: "/products",
  });
};

const cartPage = async (req, res, next) => {
  const user = req.user;
  const cartItems = user.cart.items; // have to 'get' it since it's an association, not owned column
  const productsWithQuantity = await cartItems.map((prod) => {
    const objectForCartView = extractKeys(
      prod,
      // keys of the cartItem
      ["productId", "title", "price", "imageUrl", "description", "quantity"],
      {
        shortKeys: true,
        removeAssociatedColumns: false,
      }
    );
    objectForCartView._id = objectForCartView.productId; // since productId is used for cartItem now
    return objectForCartView;
  });

  const totalPrice = productsWithQuantity.reduce((accum, prod) => {
    const quantity = prod["quantity"] ?? 0;
    const price = prod.price;

    return accum + quantity * price;
  }, 0);

  res.render("shop/cart", {
    docTitle: "Cart",
    myActivePath: "/cart",
    totalPrice,
    products: productsWithQuantity,
  });
};

const ordersPage = async (req, res, next) => {
  const user = req.user;
  let orders = await user.getOrders({ raw: true });

  orders = orders.map((order) => {
    const beautifiedOrder = extractKeys(
      order,
      ["id", "totalAmount", "shippingAddress", "createdAt"],
      {
        removeAssociatedColumns: true,
      }
    );
    beautifiedOrder.createdAt = dateToTimeStampString(
      beautifiedOrder.createdAt
    );
    return beautifiedOrder;
  });

  res.render("shop/order-list", {
    docTitle: "Orders",
    myActivePath: "/orders",
    orders,
  });
};

const orderPage = async (req, res, next) => {
  const user = req.user;
  const orderId = req.params.orderId;
  const [order = null] = await user.getOrders({ where: { id: orderId } });

  if (!order) return next(); // no orders exist, 404

  let products = await order.getProducts({
    attributes: ["id", "title", "price", "imageUrl", "description"],
    includes: {
      model: [OrderItem],
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
        "orderItem.quantity",
      ],
      {
        shortKeys: true,
        removeAssociatedColumns: false,
      }
    );
  });

  res.render("shop/order", {
    docTitle: `Order id ${order.id}`,
    id: orderId,
    myActivePath: "",
    totalAmount: order.totalAmount,
    products: products,
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
  const cartItems = user.cart.items;
  const prodId = req.body.productId;

  const productThatExists = await Product.findById(prodId);

  if (!productThatExists) return next();

  // product exists in cart
  const matchingCartItem = cartItems.find(
    (cartItem) => cartItem.productId?.toString() === prodId
  );
  // .toString since prodId from request is a string

  if (req.query.add) {
    // default is add
    if (matchingCartItem) matchingCartItem.quantity += 1;
    else cartItems.push({ productId: productThatExists._id, quantity: 1 });
  } else if (req.query.decrement) {
    if (!matchingCartItem) return next(); // 404

    matchingCartItem.quantity -= 1;
  } else if (req.query.delete) {
    user.cart.items = user.cart.items.filter(
      (cartItem) => cartItem.productId?.toString() !== prodId
    );
  } // idempotent
  else return next();

  await user.update(); // since cart is part of user

  res.redirect("/cart");
  return;
};

const createOrder = async (req, res, next) => {
  const user = req.user;
  const cart = await user.getCart();
  await Order.createFromCart(cart);

  res.redirect("/orders");
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
  createOrder,
  orderPage,
};
