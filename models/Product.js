const path = require("path");
const rootDir = require("../util/path");
const { getDb } = require(path.join(rootDir, "util", "database.js"));
const mongodb = require("mongodb");
const User = require("./User");

class Product {
  constructor({
    price = "",
    title = "",
    description = "",
    imageUrl = "",
    userId = null,
    _id = null,
  }) {
    this.price = price;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = _id ? new mongodb.ObjectId(_id) : _id;
    this.userId = userId ? new mongodb.ObjectId(userId) : userId;
  }

  static async fetchAll() {
    const db = getDb();

    try {
      const allProducts = await db.collection("products").find().toArray();
      return allProducts.map((i) => new Product(i));
    } catch (error) {
      console.log(error);
    }
  }

  static async findById(prodId) {
    const db = getDb();

    const product = await db
      .collection("products")
      .findOne({ _id: new mongodb.ObjectId(prodId) }); // _id needs to be of type ObjectId
    // have to create ObjectId here, no other way

    if (product) return new Product(product);

    return product;
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

  async update() {
    const db = getDb();
    try {
      const result = await db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async delete() {
    const db = getDb();
    try {
      await db.collection("products").deleteOne({ _id: this._id });
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
      const [firstUser = null] = await User.fetchAll();
      const newProduct = new Product({
        title: "A book",
        imageUrl:
          "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png",
        description: "This is an awesome book",
        price: 12.99,
        userId: firstUser._id,
      });

      const productResult = await newProduct.create();
      console.log("Sample products added!");
      console.log(productResult);
    }
  }
}

module.exports = Product;
