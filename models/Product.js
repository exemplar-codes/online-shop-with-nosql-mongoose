const Sequelize = require("sequelize");

const path = require("path");
const rootDir = require("../util/path");
const sequelize = require(path.join(rootDir, "util", "database.js"));

// instance of sequelize, not the class
const Product = sequelize.define(
  "product",
  {
    // model name is typically in lowercase

    id: {
      primaryKey: true,
      type: Sequelize.INTEGER, // JavaScriptish types
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },

    title: Sequelize.STRING, // shorthand for title: { type: Sequelize.STRING }.
    // We should have added allowNull: false, but this is a demo for the shorthand

    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      // afterSync: populateProducts,
    },
  }
);

const initialProducts = [
  {
    title: "A book",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png",
    description: "This is an awesome book",
    price: 12.99,
  },
  {
    title: "A laptop",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Alienware_M14x_%282%29.jpg",
    description: "A performant, quiet laptop",
    price: 1000,
  },
];

async function populateProducts() {
  try {
    const products = await Product.findAll();

    if (products.length > 0) return;

    initialProducts.forEach(async (iprod) => {
      delete iprod.id;
      const newProduct = Product.build(iprod);
      await newProduct.save();
    });
    console.log("Sample products populated!");
  } catch (error) {
    console.log(error);
    return;
  }
}

module.exports = Product;
module.exports.initialProducts = initialProducts;
module.exports.populateProducts = populateProducts;
