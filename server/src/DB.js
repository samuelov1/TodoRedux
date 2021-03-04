import { MongoClient } from "mongodb";

class DB {
  constructor(data) {
    Object.assign(this, data);
  }

  static async connect(connection, options = {}) {
    this.client = await new MongoClient(connection.uri, options).connect();
    this.db = this.client.db(connection.db);
  }

  static async disconnect() {
    this.db = {};
    await this.client.close();
  }

  static async find(collectionName, query = {}, options = {}) {
    return this.db
      .collection(collectionName)
      .find(query, options)
      .toArray();
  }

  static async findOne(collectionName, query = {}, options = {}) {
    return this.db.collection(collectionName).findOne(query, options);
  }

  static async findOneAndUpdate(
    collectionName,
    filter = {},
    update = {},
    options = {}
  ) {
    const result = await this.db
      .collection(collectionName)
      .findOneAndUpdate(filter, update, options);
    return result.value;
  }

  static async findOneAndDelete(collectionName, filter = {}, options = {}) {
    const result = await this.db
      .collection(collectionName)
      .findOneAndDelete(filter, options);
    return result.value;
  }
}

DB.db = {};
DB.client = {};

export default DB;
