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

async function populateFirstUser() {
  const users = await User.findAll({ limit: 1 });
  if (users.length)
    return;

  const firstUser = User.build({ name: 'SanjarOne', email: 'SanjarOne@gmail.com' });
  await firstUser.save();
  console.log('Sample user populated!')
}
module.exports = User;
