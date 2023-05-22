const path = require("path");
const rootDir = require("../util/path");
const { getDb } = require(path.join(rootDir, "util", "database.js"));
const mongodb = require("mongodb");

class User {
  constructor({ _id = null, name = "", email = "" }) {
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.name = name;
    this.email = email;
  }
  // Note: omitting try-catch deliberately, for less clutter
  static async fetchAll() {
    const db = getDb();

    const users = await db.collection("users").find().toArray();

    return users.map((u) => new User(u));
  }
  static async findById(userId) {
    const db = getDb();

    const user = await db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId(userId) });

    if (user) return new User(user);
    return user;
  }
  async create() {
    const db = getDb();

    const newUser = await db.collection("users").insertOne(this);

    if (newUser) return new User(newUser);
    return newUser;
  }
  async update() {
    const db = getDb();

    const result = await db.collection("users").updateOne({ _id: this._id });
    return result;
  }
  async delete() {
    const db = getDb();

    const result = await db.collection("users").deleteOne({ _id: this._id });
    return result;
  }
  static async prepopulateUsers() {
    const db = getDb();

    const existingUser = await db.collection("users").findOne();
    if (existingUser) {
      console.log("No sample user added, since some exist", existingUser);
    } else {
      const newUser = new User({
        name: "SanjarOne",
        email: "SanjarOne@gmail.com",
      });

      const userResult = await newUser.create();
      console.log("Sample user added!");
      console.log(userResult);
    }
  }
}

module.exports = User;
