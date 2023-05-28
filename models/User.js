const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

const SAMPLE_USERS = [
  {
    name: "SanjarOne",
    email: "SanjarOne@gmail.com",
  },
];
const prepopulateUsers = async () => {
  const existingUser = await User.findOne();
  if (existingUser) {
    console.log("No sample user added, since some exist");
    return existingUser;
  } else {
    const [defaultSampleUser = null] = await Promise.all(
      SAMPLE_USERS.map(async (sampleUser, idx) => {
        const newUser = new User(sampleUser); // on RAM

        const newlyCreatedUser = await newUser.save(); // from db
        // Mongoose returns the full created instance, unlike MongoDB. Convenient

        return newlyCreatedUser;
      })
    );
    console.log("Sample user/s added!");
    return defaultSampleUser;
  }
};

module.exports = { User, prepopulateUsers };

// Note: Code below is not being used, left for comparison

// const path = require("path");
// const rootDir = require("../util/path");
// const { getDb } = require(path.join(rootDir, "util", "database.js"));
// const mongodb = require("mongodb");
// const Product = require("./Product");

// class User {
//   constructor({
//     _id = null,
//     name = "",
//     email = "",
//     cart = {
//       items: [
//         /* { productId, quantity } */
//       ],
//     },
//     defaultShippingAddress = null,
//   }) {
//     this._id = _id ? new mongodb.ObjectId(_id) : null;
//     this.name = name;
//     this.email = email;
//     this.cart = cart;

//     // associated orders (structure)
//     // [
//     //   {
//     //     userId: this._id,
//     //     items: cartWithCompleteProducts.items,
//     //     totalAmount: 0,
//     //     shippingAddress,
//     //     createdAt,
//     //   },
//     // ];
//     this.defaultShippingAddress =
//       defaultShippingAddress ?? "5230 Newell Road, CA";
//   }

//   // Note: omitting try-catch deliberately, for less clutter
//   static async fetchAll() {
//     const db = getDb();

//     const users = await db.collection("users").find().toArray();

//     return users.map((u) => new User(u));
//   }
//   static async findById(userId) {
//     const db = getDb();

//     const user = await db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) });

//     if (user) return new User(user);
//     return user;
//   }
//   async create() {
//     const db = getDb();

//     const { insertedId = null } = await db.collection("users").insertOne(this);

//     // have to make an extra call to get the created document, it's just how MongoDB works
//     const newlyCreatedUser = await User.findById(insertedId);

//     // return as class instance
//     if (newlyCreatedUser) return new User(newlyCreatedUser);
//     return null;
//   }
//   async update() {
//     const db = getDb();

//     const result = await db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: this });
//     return result;
//   }
//   async delete() {
//     const db = getDb();

//     const result = await db.collection("users").deleteOne({ _id: this._id });
//     return result;
//   }

//   // cart stuff
//   async addProductToCart(prodId, quantityDelta = 1) {
//     const cartItems = this.cart.items;

//     const productThatExists = await Product.findById(prodId);

//     if (!productThatExists) return null;

//     // product exists in cart
//     const matchingCartItem = cartItems.find(
//       (cartItem) => cartItem.productId?.toString() === prodId
//     );

//     // add
//     if (matchingCartItem) matchingCartItem.quantity += 1;
//     else
//       cartItems.push({
//         productId: productThatExists._id,
//         quantity: quantityDelta,
//       });

//     await this.update();
//   }

//   async decrementProductFromCart(prodId, quantityDelta = 1) {
//     const cartItems = this.cart.items;

//     // product exists in cart
//     const matchingCartItem = cartItems.find(
//       (cartItem) => cartItem.productId?.toString() === prodId
//     );

//     matchingCartItem.quantity -= quantityDelta;

//     if (matchingCartItem.quantity <= 0) await this.deleteItemFromCart(prodId);
//     else await this.update();
//   }

//   async deleteItemFromCart(prodId) {
//     this.cart.items = this.cart.items.filter(
//       (cartItem) => cartItem.productId?.toString() !== prodId
//     );

//     await this.update();
//   }

//   // cart utils
//   // Note, this is added as a separate collection, and nothing was added to User class to indicate this
//   // ideally this is not good, since User now has functionality (and) that's absent (not mentioned) in the constructor
//   // but it's Ok for now. Alternatively, we could have created a new model called Order. But I'm skipping this for now
//   async getCartWithCompleteProducts() {
//     const cartItems = this.cart.items; // have to 'get' it since it's an association, not owned column

//     // #1, get full products for each cartItem (which only has productId)
//     const db = getDb();
//     const productIds = cartItems.map((cartItem) => cartItem.productId);
//     const completeProductsInCartItems = await db
//       .collection("products")
//       .find({
//         _id: {
//           $in: productIds,
//           // order of this does not change return order
//           // it is always sorted according to _id
//         },
//       })
//       .toArray();

//     // #2, return order may not be correct, and since cartItems are expected to be ordered
//     // doing simple search
//     // I know O(n^2) but the main thing was demoing `$in` operator
//     const cartItemsWithQuantity = cartItems.map((cartItem) => {
//       const fullProductForCartItem = completeProductsInCartItems.find(
//         (product) => product._id.toString() === cartItem.productId.toString()
//       );

//       return {
//         ...fullProductForCartItem,
//         quantity: cartItem.quantity,
//       };
//     });

//     return { items: cartItemsWithQuantity };
//   }

//   async getCartTotal() {
//     // get full product, so we can access prices
//     const cartWithCompleteProducts = await this.getCartWithCompleteProducts();
//     const cartItemsWithProductPrices = cartWithCompleteProducts.items;

//     const totalPrice = cartItemsWithProductPrices.reduce((accum, prod) => {
//       const quantity = prod.quantity ?? 0;
//       const price = prod.price ?? -1;

//       return accum + quantity * price;
//     }, 0);

//     return totalPrice;
//   }

//   // order stuff
//   async createOrder(currentShippingAddress = this.defaultShippingAddress) {
//     // aka add an Order
//     const db = getDb();

//     const cartWithCompleteProducts = await this.getCartWithCompleteProducts();
//     const totalAmount = await this.getCartTotal();

//     const orderToBeCreated = {
//       userId: this._id,
//       items: cartWithCompleteProducts.items,
//       totalAmount,
//       shippingAddress: currentShippingAddress,
//       createdAt: new Date().toISOString(),
//     };
//     await db.collection("orders").insertOne(orderToBeCreated);

//     // empty the cart
//     this.cart = {
//       items: [],
//     };

//     await this.update();

//     return null;
//   }
//   async getOrders() {
//     const db = getDb();
//     return await db
//       .collection("orders")
//       .find({
//         userId: this._id,
//       })
//       .toArray();
//   }
//   async getOrder(orderId) {
//     const db = getDb();
//     const order = await db.collection("orders").findOne({
//       _id: new mongodb.ObjectId(orderId),
//     });
//     return order;
//   }

//   // pre-population
//   static SAMPLE_USERS = [
//     {
//       name: "SanjarOne",
//       email: "SanjarOne@gmail.com",
//     },
//   ];
//   static async prepopulateUsers() {
//     const db = getDb();

//     const existingUser = await db.collection("users").findOne();
//     if (existingUser) {
//       console.log("No sample user added, since some exist");
//       return existingUser;
//     } else {
//       const [defaultSampleUser = null] = await Promise.all(
//         User.SAMPLE_USERS.map(async (sampleUser, idx) => {
//           const newUser = new User(sampleUser); // on RAM

//           const newlyCreatedUser = await newUser.create(); // from db

//           return newlyCreatedUser;
//         })
//       );
//       console.log("Sample user/s added!");
//       return defaultSampleUser;
//     }
//   }
// }

// module.exports = User;
