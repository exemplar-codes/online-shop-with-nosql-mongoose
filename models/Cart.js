const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  items: [
    {
      productId: {
        ref: "Product",
        type: Schema.Types.ObjectId,
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;

// // NOT USED ANYMORE (in mongodb version of this app)
// const Sequelize = require("sequelize");

// const path = require("path");
// const rootDir = require("../util/path");
// const sequelize = require(path.join(rootDir, "util", "database.js"));

// const Cart = sequelize.define("cart", {
//   id: {
//     primaryKey: true,
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     unique: true,
//   },
//   // A cart has many items, and an associated quantity.
//   // since cart items are an array, and we cannot store an array in the cart table, let's create a model called cartitem
// });

// // // for initial population
// // // this runs only once, since file import are cached in Node.js
// // (async () => {
// //   if (true || potentialError?.code !== "ENOENT") {
// //     try {
// //       await fs.mkdir(path.dirname(cartDataFilePath), { recursive: true });
// //       await fs.writeFile(
// //         cartDataFilePath,
// //         JSON.stringify({ products: [], totalPrice: 0 }),
// //         {
// //           encoding: "utf-8",
// //         }
// //       );
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   }
// // })();

// module.exports = Cart;
