const env = require("dotenv").config().parsed;
/**
 * ENV keys: MONGODB_PASSWORD
 */
const database_password = env["MONGODB_PASSWORD"];

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://sanjarcode-nodejscompleteguide:${database_password}@cluster-nodejscompleteg.nuohpop.mongodb.net/?retryWrites=true&w=majority`
  ) // Copied from the site (SRV address)
    .then((client) => {
      console.log("Connected!");
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect; // is a function
