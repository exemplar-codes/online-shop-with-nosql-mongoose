const Sequelize = require("sequelize");

const path = require("path");
const rootDir = require("../util/path");
const sequelize = require(path.join(rootDir, "util", "database.js"));

const CartItem = sequelize.define("cart-item", {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
  // has an associated product, this model exists already
  // and a quantity, this is a scalar, so add it here itself
  quantity: Sequelize.INTEGER,
});

module.exports = CartItem;
