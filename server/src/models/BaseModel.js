import { MongoClient } from 'mongodb';

class BaseModel {
    static async connect(connection, options = {}) {
        BaseModel.client = await new MongoClient(connection.uri, options).connect();
        BaseModel.db = BaseModel.client.db(connection.db);
    }

    static async disconnect() {
        BaseModel.db = {};
        await BaseModel.client.close();
    }
}

BaseModel.db = {};
BaseModel.client = {};

export default BaseModel;