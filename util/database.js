const env = require("dotenv").config().parsed;
/**
 * ENV keys: MONGODB_PASSWORD
 */
const database_password = env["MONGODB_PASSWORD"];

const mongoose = require("mongoose");

let _db;

const mongooseConnect = (cb) =>
  mongoose
    .connect(
      `mongodb+srv://sanjarcode-nodejscompleteguide:${database_password}@cluster-nodejscompleteg.nuohpop.mongodb.net/?retryWrites=true&w=majority`
    )
    .then((mongooseObject) => {
      const mongoDbClient = mongooseObject.connection.getClient();
      _db = mongoDbClient.db();
    })
    .then(cb)
    .catch(console.log);

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

module.exports = { mongooseConnect, getDb };

// Note: Code below is not being used, left for comparison
// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// let _db;

// const mongoConnect = (callback = () => {}) => {
//   MongoClient.connect(
//     `mongodb+srv://sanjarcode-nodejscompleteguide:${database_password}@cluster-nodejscompleteg.nuohpop.mongodb.net/?retryWrites=true&w=majority`
//   ) // Copied from the site (SRV address)
//     .then((client) => {
//       console.log("Connected to MongoDB cloud!");
//       _db = client.db();
//       callback(client);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "No database found!";
// };

// /**
//  * irrelevant to the shop, just for check
//  * Is idempotent, makes change only if database is empty
//  */
// //
// const prepopulateIrrelevantSampleData = async () => {
//   const db = getDb();
//   const result = await db.collection("trial-collection").findOne();

//   const exists = !!result;

//   if (!exists) {
//     const createdResult = await db
//       .collection("trial-collection")
//       .insertOne({ name: "Woods", friendName: "Mason" });
//     console.log("Database was empty, added sample irrelevant data");
//     console.log(createdResult);
//   } else {
//     console.log("Database has data, no changes made");
//     // console.log(result);
//   }
// };

// module.exports = {
//   getDb,
//   prepopulateIrrelevantSampleData,
//   mongooseConnect,
// };
