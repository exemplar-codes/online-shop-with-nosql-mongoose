const path = require("path");
const rootDir = require("../util/path");
const { getDb } = require(path.join(rootDir, "util", "database.js"));

class Product {
  constructor({ price = "", title = "", description = "", imageUrl = "" }) {
    this.price = price;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  static async fetchAll() {
    const db = getDb();

    try {
      const allProducts = await db.collection("products").find().toArray();
      return allProducts;
    } catch (error) {
      console.log(error);
    }
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

  /**
   * Add a sample product
   * Is idempotent, makes change only if database is empty
   */
  //
  static async prepopulateProducts() {
    const db = getDb();
    const existingProduct = await db.collection("products").findOne();
    if (existingProduct) {
      console.log(
        "No sample products added, since some exist",
        existingProduct
      );
    } else {
      const newProduct = new Product({
        title: "A book",
        imageUrl:
          "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png",
        description: "This is an awesome book",
        price: 12.99,
      });

      const productResult = await newProduct.create();
      console.log("Sample products added!");
      console.log(productResult);
    }
  }
}

module.exports = Product;
