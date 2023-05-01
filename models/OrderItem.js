// duplicated from models/CartItem
const Sequelize = require("sequelize");

const path = require("path");
const rootDir = require("../util/path");
const sequelize = require(path.join(rootDir, "util", "database.js"));

const OrderItem = sequelize.define("orderItem", {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
  quantity: Sequelize.INTEGER,
});

module.exports = OrderItem;
