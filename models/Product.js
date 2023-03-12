const fs = require("fs/promises");
const path = require("path");

const rootDir = require("../util/path");
const productDataFilePath = path.join(rootDir, "data", "products.json");

class Product {
  constructor(title) {
    this.title = title;
    //  deliberately ignoring id, or update for this demo.
  }

  async save() {
    try {
      const fileContents = await fs.readFile(productDataFilePath, {
        encoding: "utf-8",
      });

      const products = JSON.parse(fileContents.toString());

      products.push(this); // `this` refers to the Product instance

      await fs.writeFile(productDataFilePath, JSON.stringify(products), {
        encoding: "utf-8",
      });

      return null;
    } catch (err) {
      return err;
    }
  }

  static async fetchAll() {
    try {
      const fileContents = await fs.readFile(
        path.join(rootDir, "data", "products.json"),
        { encoding: "utf-8" }
      );

      return JSON.parse(fileContents.toString());
    } catch (err) {
      return err;
    }
  }

  static async deleteAll() {
    try {
      const products = [];
      await fs.writeFile(productDataFilePath, JSON.stringify(products), {
        encoding: "utf-8",
      });

      return null;
    } catch (err) {
      return err;
    }
  }
}

// for initial population
// this runs only once, since file import are cached in Node.js
(async () => {
  const firstProduct = new Product("An awesome book");
  await firstProduct.save();
})();

module.exports = Product;
