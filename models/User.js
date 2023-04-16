const Sequelize = require("sequelize");

const path = require("path");
const rootDir = require("../util/path");
const sequelize = require(path.join(rootDir, "util", "database.js"));

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },

  name: Sequelize.STRING,
  email: Sequelize.STRING,
}, {
  hooks: {
    afterSync: populateFirstUser,
  }
});

const initialUsers = [{ name: "SanjarOne", email: "SanjarOne@gmail.com" }];

async function populateFirstUser() {
  try {
    const products = await User.findAll();

    if (products.length > 0) return;

    initialUsers.forEach(async (iuser) => {
      delete iuser.id;
      const newUser = User.build(iuser);
      newUser.save();
    });
    console.log("Sample user populated!");
  } catch (error) {
    console.log(error);
    return;
  }
}

module.exports = User;
