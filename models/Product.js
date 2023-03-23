const fs = require("fs/promises");
const path = require("path");

const rootDir = require("../util/path");
const productDataFilePath = path.join(rootDir, "data", "products.json");

const db = require(path.join(rootDir, "util", "database.js"));

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
      // const fileContents = await fs.readFile(productDataFilePath, {
      //   encoding: "utf-8",
      // });
      // const products = JSON.parse(fileContents.toString());
      // const productIndex = products.findIndex((item) => item.id == this.id);
      // if (productIndex === -1) {
      //   products.push(this); // `this` refers to the Product instance
      // } else {
      //   products[productIndex] = this;
      // }
      // await fs.writeFile(productDataFilePath, JSON.stringify(products), {
      //   encoding: "utf-8",
      // });
      // return null;

      await db.execute(
        "INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?);",
        [this.title, this.imageUrl, this.description, this.price.toString()]
      );
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static async delete(prodId) {
    try {
      // const fileContents = await fs.readFile(productDataFilePath, {
      //   encoding: "utf-8",
      // });

      // const products = JSON.parse(fileContents.toString());

      // const productIndex = products.findIndex((item) => item.id == prodId);
      // if (productIndex !== -1) {
      //   products.splice(productIndex, productIndex + 1);

      //   await fs.writeFile(productDataFilePath, JSON.stringify(products), {
      //     encoding: "utf-8",
      //   });

      //   return true;
      // }

      await db.execute("DELETE FROM products WHERE id=?", [prodId]);
    } catch (err) {
      console.log(err);
      return false; // indicate error
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
      // const fileContents = await fs.readFile(productDataFilePath);

      // const products = JSON.parse(fileContents.toString());

      // return products.find((item) => item.id == id) ?? null; // params are strings, funny bug

      // dangerous - SQL injection possible
      // const [rows] = await db.execute(`SELECT * FROM products WHERE ID=${id}`);

      // Does the same thing as above. But better.
      // ? is the placeholder where mysql2 will substitute sanitized equivalents of the elements (passed in the array)
      const [rows] = await db.execute(`SELECT * FROM products WHERE ID=?`, [
        id,
      ]);

      console.log(rows);
      return rows[0] ?? null;
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

const initialProducts = [
  {
    id: 1,
    title: "A book",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png",
    description: "This is an awesome book",
    price: 12.99,
  },
  {
    id: 2,
    title: "A laptop",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Alienware_M14x_%282%29.jpg",
    description: "A performant, quiet laptop",
    price: 1000,
  },
];

(async () => {
  try {
    const productsInDB = await Product.fetchAll();

    if (productsInDB.length > 0) return;

    console.log("DB is empty");
    initialProducts.forEach(
      async ({ id, title, imageUrl, description, price }) => {
        const newProduct = new Product(title, imageUrl, description, price);
        await newProduct.save();
      }
    );
    console.log("DB populated with mock data");
  } catch (err) {
    console.log(err);
  }
})();

module.exports = Product;
