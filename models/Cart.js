const fs = require("fs/promises");
const path = require("path");

const rootDir = require("../util/path");
const Product = require("./Product");
const cartDataFilePath = path.join(rootDir, "data", "cart.json");

class Cart {
  constructor() {
    this.products = []; // type: Product
    this.totalPrice = 0;
  }

  static async addProduct(id, productPrice, qty = 1) {
    // Fetch the previous cart
    // Analyze the products in it
    // Add/increase the quantity

    try {
      const cartFileContent = await fs.readFile(cartDataFilePath);

      const cart = JSON.parse(cartFileContent);

      const productIndexInCart = cart.products.findIndex((item) => item.id == id);

      if (productIndexInCart !== -1) {
        cart.products[productIndexInCart].quantity += qty;
      } else {
        cart.products.push({ id, quantity: qty });
      }

      // update price
      cart.totalPrice += qty * productPrice;

      // save to file
      await fs.writeFile(cartDataFilePath, JSON.stringify(cart), {
        encoding: "utf-8",
      });
    } catch (err) {
      return err;
    }
  }
}

// for initial population
// this runs only once, since file import are cached in Node.js
(async () => {
  if (true || potentialError?.code !== "ENOENT") {
    try {
      await fs.mkdir(path.dirname(cartDataFilePath), { recursive: true });
      await fs.writeFile(
        cartDataFilePath,
        JSON.stringify({ products: [], totalPrice: 0 }),
        {
          encoding: "utf-8",
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
})();

module.exports = Cart;
