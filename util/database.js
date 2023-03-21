const mysql = require("mysql2");
const env = require("dotenv").config().parsed;

const database_password = env["MYSQL_DATABASE_PASSWORD"];

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // the user we set up in the MySQL Database
  database: "node-complete", // name of the database
  password: database_password, // password for the 'user' set up in the MySQL database
}); // instead of .createConnection

module.exports = pool.promise(); // return a promise since a pool does async ops (since it connects to database)
