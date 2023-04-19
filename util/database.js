const env = require("dotenv").config().parsed;
const database_password = env["MYSQL_DATABASE_PASSWORD"];

const Sequelize = require("sequelize");

// (database, username, password, options)
const sequelize = new Sequelize("node-complete", "root", database_password, {
  host: "localhost",
  dialect: "mysql",
  hooks: {
    afterBulkSync: populateDatabaseWithSampleData,
  },
});

module.exports = sequelize;

async function populateDatabaseWithSampleData(x) {
  const User = require("../models/User");
  const Product = require("../models/Product");

  const users = await User.findAll({ limit: 1 });

  if (users.length > 0) return;

  // create a user
  // const newUser = User.build(User.initialUsers[0]);
  // await newUser.save();

  // create products associated with the user
  const initialProducts = Product.initialProducts;
  for (const sampleProd of initialProducts) {
    /**
     * Approach 1.0 - 'build' Product independently, save to DB, then associate the record
     */
    // const newProd = await Product.build(sampleProd);
    // await newProd.save();
    // await newUser.addProduct(newProd);
    /**
     * Approach 1.1 - 'create' a Product independently, then associate with the user record,
     *   using User's mixin
     * Minor variation of 2
     */
    // const newProd = await Product.create(sampleProd);
    // await newUser.addProduct(newProd);
    /**
     * Approach 2 - 'create' a Product, using User instance's mixin, in one go.
     */
    // await newUser.createProduct(sampleProd);
  }

  /**
   * Approach 3.1 - create the User, and associated Products all in one go
   */
  await User.create(
    {
      ...User.initialUsers[0],
      [Sequelize.Utils.pluralize(Product.name)]: initialProducts, // array of model instances would be OK too
    },
    { include: [{ model: Product }] }
  );
}

// No need to write the following. Sequelize does this for us
// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root", // the user we set up in the MySQL Database
//   database: "node-complete", // name of the database
//   password: database_password, // password for the 'user' set up in the MySQL database
// }); // instead of .createConnection

// module.exports = pool.promise(); // return a promise since a pool does async ops (since it connects to database)
