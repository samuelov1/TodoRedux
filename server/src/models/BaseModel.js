import { MongoClient } from "mongodb";

class BaseModel {
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

  static async findById(id) {
    const collection = this.db.collection(this.collectionName);
    const result = await collection.findOne({ _id: id });

    return this.modelFactory(result);
  }

  static async findOneAndUpdate(...args) {
    const collection = this.db.collection(this.collectionName);
    const result = await collection.findOneAndUpdate(...args);

    return this.modelFactory(result.value);
  }

  static async find(...args) {
    const collection = this.db.collection(this.collectionName);
    const result = await collection.find(...args).toArray();

    return this.modelFactory(result);
  }

  static async modelFactory(result) {
    if (Array.isArray(result)) {
      const promises = result.map((result) => this.createModel(result));
      return Promise.all(promises);
    }

    return this.createModel(result);
  }
}

BaseModel.db = {};
BaseModel.client = {};

export default BaseModel;
