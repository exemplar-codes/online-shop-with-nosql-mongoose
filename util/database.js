const env = require("dotenv").config().parsed;
/**
 * ENV keys: MONGODB_PASSWORD
 */
const database_password = env["MONGODB_PASSWORD"];

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://sanjarcode-nodejscompleteguide:${database_password}@cluster-nodejscompleteg.nuohpop.mongodb.net/?retryWrites=true&w=majority`
  ) // Copied from the site (SRV address)
    .then((client) => {
      console.log("Connected to MongoDB cloud!");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

module.exports = { mongoConnect, getDb };
