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

  const totalPrice = products.reduce((accum, prod) => {
    const quantity = prod["quantity"] ?? 0;
    const price = prod.price;

    return accum + quantity * price;
  }, 0);

  res.render("shop/cart", {
    docTitle: "Cart",
    myActivePath: "/cart",
    totalPrice,
    products: products,
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
    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      await cart.addProduct(prodId, { through: { quantity: 1 } });
    }
  } else if (req.query.decrement) {
    if (!cartItem) return next(); // 404

    cartItem.quantity -= 1;
    await cartItem.save();
  } else if (req.query.delete) await cartItem?.destroy(); // idempotent
  else return next();

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
