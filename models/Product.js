const fs = require("fs/promises");
const path = require("path");

const rootDir = require("../util/path");
const productDataFilePath = path.join(rootDir, "data", "products.json");

class Product {
  constructor(title, imageUrl, description, price) {
    //  deliberately ignoring id, or update for this demo.
    this.id = Math.floor(Math.random() * 100);
    this.title = title;
    this.imageUrl =
      imageUrl ||
      "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png";
    this.description = description || "No description";
    this.price = price || 19.99;
  }

  async save() {
    try {
      const fileContents = await fs.readFile(productDataFilePath, {
        encoding: "utf-8",
      });

      const products = JSON.parse(fileContents.toString());

      const productIndex = products.findIndex((item) => item.id == this.id);
      if (productIndex === -1) {
        products.push(this); // `this` refers to the Product instance
      } else {
        products[productIndex] = this;
      }

      await fs.writeFile(productDataFilePath, JSON.stringify(products), {
        encoding: "utf-8",
      });

      return null;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async delete(prodId) {
    try {
      const fileContents = await fs.readFile(productDataFilePath, {
        encoding: "utf-8",
      });

      const products = JSON.parse(fileContents.toString());

      const productIndex = products.findIndex((item) => item.id == prodId);
      if (productIndex !== -1) {
        products.splice(productIndex, productIndex + 1);

        await fs.writeFile(productDataFilePath, JSON.stringify(products), {
          encoding: "utf-8",
        });

        return true;
      }

      return false; // indicate error
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async fetchAll() {
    try {
      // const fileContents = await fs.readFile(productDataFilePath);

      // return JSON.parse(fileContents.toString());

      const [rows] = await db.execute("SELECT * FROM products");
      return rows;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async findById(id) {
    try {
      const fileContents = await fs.readFile(productDataFilePath);

      const products = JSON.parse(fileContents.toString());

      return products.find((item) => item.id == id) ?? null; // params are strings, funny bug
    } catch (err) {
      console.log(err);
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
      console.log(err);
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
