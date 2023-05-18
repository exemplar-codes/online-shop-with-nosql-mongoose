const path = require("path");
const rootDir = require("../util/path");
const { getDb } = require(path.join(rootDir, "util", "database.js"));

class Product {
  constructor(price, title, description, imageUrl) {
    this.price = price;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  async create() {
    const db = getDb();
    try {
      const result = await db.collection("products").insertOne(this);
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Product;
