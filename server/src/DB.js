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
}

DB.db = {};
DB.client = {};

export default DB;