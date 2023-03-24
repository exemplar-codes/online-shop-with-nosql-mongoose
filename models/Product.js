const Sequelize = require("sequelize");

const path = require("path");
const rootDir = require("../util/path");
const sequelize = require(path.join(rootDir, "util", "database.js"));

// instance of sequelize, not the class
const Product = sequelize.define("product", {
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
});

module.exports = Product;
