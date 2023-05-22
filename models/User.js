const mongodb = require("mongodb");

class User {
  constructor({ _id = null, name = "", email = "" }) {
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.name = name;
    this.email = email;
  }
  static async fetchAll() {}
  static async findById(userId) {}
  async create() {}
  async update() {}
  async delete() {}
  static async prepopulateUsers() {}
}

module.exports = User;
