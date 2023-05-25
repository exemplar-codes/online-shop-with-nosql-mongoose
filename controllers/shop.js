const Product = require("../models/Product");
const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");
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

  // map doesn't work with async functions, since the function evaluates to a promise
  // use Promise.all, no choice
  const cartItemsWithQuantity = await Promise.all(
    cartItems.map(async (cartItem) => {
      const fullProduct = await Product.findById(cartItem.productId);
      const objectForCartView = extractKeys(
        { ...fullProduct, ...cartItem },
        // keys of the cartItem
        ["_id", "title", "price", "imageUrl", "description", "quantity"],
        {
          shortKeys: true,
          removeAssociatedColumns: false,
        }
      );

      return objectForCartView;
    })
  );

  const totalPrice = cartItemsWithQuantity?.reduce((accum, prod) => {
    const quantity = prod["quantity"] ?? 0;
    const price = prod.price;

    return accum + quantity * price;
  }, 0);

  res.render("shop/cart", {
    docTitle: "Cart",
    myActivePath: "/cart",
    totalPrice,
    products: cartItemsWithQuantity ?? [],
  });
};

const cartPageUsingIncludesOperator = async (req, res, next) => {
  const user = req.user;
  const cartItems = user.cart.items; // have to 'get' it since it's an association, not owned column

  // #1, get full products for each cartItem (which only has productId)
  const db = getDb();
  const productIds = cartItems.map(
    (cartItem) => new ObjectId(cartItem.productId)
  );
  const completeProductsInCartItems = await db
    .collection("products")
    .find({
      _id: {
        $in: productIds,
        // order of this does not change return order
        // it is always sorted according to _id
      },
    })
    .toArray();

  // #2, return order may not be correct, and since cartItems are expected to be ordered
  // doing simple search
  // I know O(n^2) but the main thing was demoing `$in` operator
  const cartItemsWithQuantity = cartItems.map((cartItem) => {
    const fullProductForCartItem = completeProductsInCartItems.find(
      (product) => product._id.toString() === cartItem.productId.toString()
    );

    return {
      ...fullProductForCartItem,
      quantity: cartItem.quantity,
    };
  });

  // #3 total to show
  const totalPrice = cartItemsWithQuantity?.reduce((accum, prod) => {
    const quantity = prod["quantity"] ?? 0;
    const price = prod.price;

    return accum + quantity * price;
  }, 0);

  res.render("shop/cart", {
    docTitle: "Cart",
    myActivePath: "/cart",
    totalPrice,
    products: cartItemsWithQuantity ?? [],
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
  const prodId = req.body.productId;
  const quantityDelta = req.body.quantity ?? 1;

  // refactored logic from here into models
  // "fat models, skinny controllers"
  if (req.query.add) {
    await user.addProductToCart(prodId, quantityDelta);
  } else if (req.query.decrement) {
    await user.decrementProductFromCart(prodId, quantityDelta);
  } else if (req.query.delete) {
    await user.deleteItemFromCart(prodId);
  }

  res.redirect("/cart");
  return;
};

const createOrder = async (req, res, next) => {
  const user = req.user;
  await user.createOrder();

  res.redirect("/orders");
};

const checkoutEditPage = async (req, res, next) => {
  res.redirect("/");
};

module.exports = {
  indexPage,
  getProducts,
  cartPage,
  cartPageUsingIncludesOperator,
  checkoutPage,
  getProduct,
  postCart,
  checkoutEditPage,
  ordersPage,
  createOrder,
  orderPage,
};
