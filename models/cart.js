const fs = require("fs");
const path = require("path");

const cartPath = path.join(__dirname, "..", "data", "cart.json");

const getCartItemsFromFile = (cb) => {
  fs.readFile(cartPath, (err, cartItems) => {
    if (!cartItems) {
      cb([]);
    } else {
      cb(JSON.parse(cartItems));
    }
  });
};

class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(cartPath, (err, cartItems) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(cartItems);
      }

      let existingItemIndex = cart.products.findIndex((item) => item.id === id);
      console.log("index", existingItemIndex);
      let existingItem = cart.products[existingItemIndex];
      let updatedProduct;

      if (existingItem) {
        updatedProduct = { ...existingItem };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingItemIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + Number(productPrice);
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        console.log("added item to cart");
      });
    });
  }

  static getCartItems(cb) {
    fs.readFile(cartPath, (err, cart) => {
      const cartObject = JSON.parse(cart);
      if (!err) {
        cb(cartObject);
      } else {
        cb({});
      }
    });
  }
}

module.exports = Cart;
