const mongoose = require("mongoose");

// an order is a frozen copy of a cart
const OrderSchema = new mongoose.Schema(
  {
    userId: { ref: "User", type: mongoose.Types.ObjectId, required: true },
    shippingAddress: { type: String, required: false },
    items: [
      {
        price: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },

        userId: {
          ref: "User",
          type: mongoose.Types.ObjectId,
          required: true,
        },

        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = { Order };

// // NOT USED ANYMORE (in mongodb version of this app)
// // duplicated from models/Cart
// const Sequelize = require("sequelize");

// const path = require("path");
// const rootDir = require("../util/path");
// const sequelize = require(path.join(rootDir, "util", "database.js"));

// const Cart = require("./Cart");
// const CartItem = require("./CartItem");

// const Order = sequelize.define("order", {
//   id: {
//     primaryKey: true,
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     unique: true,
//   },
//   totalAmount: Sequelize.DOUBLE,
//   shippingAddress: Sequelize.STRING,
// });

// // v6 way to add attributes/methods
// // Order.myStaticMethod = function () { }; // add static methods
// // Order.prototype.myInstanceMethod = function () {}; // add instance methods

// /**
//  * an Order is basically a frozen copy of a Cart.
//  * this function is the copy part
//  */
// Order.createFromCart = async function (cartOrCartId) {
//   // x1. create the order, postpone, will do from a user instance
//   //   const newOrder = await Order.create();

//   // 2. get the cart
//   let cart = null;
//   // check if argument is cartId, or cart instance
//   if ([typeof "", typeof 0].includes(typeof cartOrCartId)) {
//     cart = await Cart.fetchByPk(cartOrCartId);
//   } else cart = cartOrCartId;

//   // x1. (continue) Create the order
//   const user = await cart.getUser(); // assume cart always has a user (which does make sense)
//   const newOrder = await user.createOrder();

//   // 3. get products and copy (duplicate/deep) CartItems from the Cart
//   const productsOfCart = await cart.getProducts({
//     includes: { model: [CartItem] },
//   });

//   for (let prod of productsOfCart) {
//     newOrder.addProduct(prod, {
//       through: { quantity: prod.cartItem.quantity },
//     });
//   }

//   const totalAmount = productsOfCart.reduce((accum, prod) => {
//     const quantity = prod.cartItem.quantity ?? 0;
//     const price = prod.price;

//     return accum + quantity * price;
//   }, 0);

//   await newOrder.update({ totalAmount });

//   return newOrder;
// };

// module.exports = Order;
