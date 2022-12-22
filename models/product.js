const mongodb = require("mongodb");
const { getDb } = require("../util/database");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  async save() {
    const db = getDb();

    const collection = db.collection("products");

    let dbOperation;
    if (this._id) {
      // if editing there should be an id
      dbOperation = await collection.updateOne(
        { _id: this._id },
        { $set: this }
      );
    } else {
      // if creating a new product no id yet.
      dbOperation = await collection.insertOne(this);
    }

    return dbOperation;
  }

  static async getAllProducts() {
    const db = getDb();

    const collection = db.collection("products");

    const productList = await collection.find({}).toArray();

    return productList;
  }

  static async getProductById(id) {
    const db = getDb();

    const collection = db.collection("products");

    const product = await collection
      .find({ _id: new mongodb.ObjectId(id) })
      .next();

    return product;
  }

  static async deleteProduct(id) {
    const db = getDb();

    const collection = db.collection("products");

    const productToDelete = await collection.deleteOne({
      _id: new mongodb.ObjectId(id),
    });

    return productToDelete;
  }
}

module.exports = Product;
