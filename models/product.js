const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");

const _path = path.join(__dirname, "..", "data", "products.json");
const cartPath = path.join(__dirname, "..", "data", "cart.json");

const getProductsFromFile = (cb) => {
  fs.readFile(_path, (err, fileContent) => {
    if (!fileContent) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(passedTitle, imageUrl, description, price) {
    this.title = passedTitle;
    this.url = imageUrl;
    this.description = description;
    this.price = price;
    this.id = null;
  }

  save() {
    getProductsFromFile((products) => {
      this.id = v4();
      products.push(this);
      fs.writeFile(_path, JSON.stringify(products), (err) => {
        console.log("HELLO");
      });
    });
  }

  static getProductById(id, cb) {
    getProductsFromFile((products) => {
      let foundProduct = products.find((item) => item.id === id);
      cb(foundProduct);
    });
  }

  static editItem(id, itemDetails) {
    getProductsFromFile((products) => {
      let editedItem = { ...itemDetails, id };
      let newList = [...products.filter((item) => item.id !== id), editedItem];
      fs.writeFile(_path, JSON.stringify(newList), (err) => {
        console.log("edited");
      });
    });
  }

  static delete(id) {
    getProductsFromFile((products) => {
      let newList = products.filter((item) => item.id !== id);
      fs.writeFile(_path, JSON.stringify(newList), (err) => {
        console.log("deleted");
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
}

module.exports = Product;

// so, save and fetchall both calls getProductsFromFile function.
// that function accepts a callback function as an argument
// reads file and depending whether empty or not, calls the passed callback with either empty array or array with read content
// returned array is what is then passed as argument to the callback function passed. yes i know its confusing haha

// getProductsFromFile => returns an array. => that array (products) passed as argument to callback of either save or fetch
