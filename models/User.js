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
    afterSync: populateUsers,
  }
});

const initialUsers = [{ name: "SanjarOne", email: "SanjarOne@gmail.com" }];

async function populateUsers() {
  try {
    const users = await User.findAll({ limit: 1});

    if (users.length > 0) return;

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
module.exports.initialUsers = initialUsers;
module.exports.populateUsers = populateUsers;
