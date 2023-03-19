const fs = require("fs/promises");
const path = require("path");

const rootDir = require("../util/path");
const productDataFilePath = path.join(rootDir, "data", "products.json");

class Product {
  constructor(title, imageUrl, description = "No description", price = 19.99) {
    //  deliberately ignoring id, or update for this demo.
    this.id = Math.floor(Math.random() * 100);
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
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
      const fileContents = await fs.readFile(productDataFilePath);

      return JSON.parse(fileContents.toString());
    } catch (err) {
      return err;
    }
  }

  static async findById(id) {
    try {
      const fileContents = await fs.readFile(productDataFilePath);

      const products = JSON.parse(fileContents.toString());

      return products.find((item) => item.id == id) ?? null; // params are strings, funny bug
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
  const potentialError = await firstProduct.save();
  if (true || potentialError?.code !== "ENOENT") {
    try {
      await fs.mkdir(path.dirname(productDataFilePath), { recursive: true });
      await fs.writeFile(productDataFilePath, JSON.stringify([]), {
        encoding: "utf-8",
      });
      await firstProduct.save();
    } catch (err) {
      console.log(err);
    }
  }
})();

module.exports = Product;
