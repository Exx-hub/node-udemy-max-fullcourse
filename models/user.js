const mongodb = require("mongodb");
const { getDb } = require("../util/database");

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // { items: [] }
    this._id = id;
  }

  async save() {
    const db = getDb();

    const usersCollection = db.collection("users");

    const createdUser = await usersCollection.insertOne(this);

    return createdUser;
  }

  async addToCart(product) {
    let updatedCart;
    let newQuantity;

    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex < 0) {
      newQuantity = 1;
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    } else {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }

    updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();

    const usersCollection = db.collection("users");

    const cartAdded = await usersCollection.updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );

    return cartAdded;
  }

  async deleteCartItem(prodId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== prodId.toString()
    );

    const db = getDb();

    const usersCollection = db.collection("users");

    const updatedCart = {
      items: updatedCartItems,
    };

    const deletedItem = await usersCollection.updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );

    return deletedItem;
  }

  async getCart() {
    const db = getDb();

    const productsCollection = db.collection("products");
    const productIds = this.cart.items.map((item) => item.productId); // get only the productids and save in an array

    // pass product ids array to the $in mongodb function to use as find filter.

    const products = await productsCollection
      .find({ _id: { $in: productIds } })
      .toArray();

    // console.log("products", products);

    // now the you have the products that matched with the ids, map through them to add a quantity property
    // based on the saved quantity from the cart....
    return products.map((product) => {
      const cartItem = this.cart.items.find(
        (item) => item.productId.toString() === product._id.toString()
      );
      return { ...product, quantity: cartItem.quantity };
    });
  }

  async addOrder() {
    const db = getDb();

    const ordersCollection = db.collection("orders");

    const products = await this.getCart();

    const order = {
      items: products,
      user: {
        _id: new ObjectId(this._id),
        name: this.name,
      },
    };

    await ordersCollection.insertOne(order);

    this.cart = { items: [] };

    const usersCollection = db.collection("users");

    const cartAdded = await usersCollection.updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: { items: [] } } }
    );
  }

  async getUserOrders() {
    const db = getDb();

    const ordersCollection = db.collection("orders");

    const ordersArray = await ordersCollection
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();

    return ordersArray;
  }

  static async findUserById(id) {
    const db = getDb();

    const usersCollection = db.collection("users");

    const foundUser = usersCollection.findOne({ _id: new ObjectId(id) });

    return foundUser;
  }
}

module.exports = User;
