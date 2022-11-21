const fs = require("fs");
const path = require("path");

const _path = path.join(__dirname, "..", "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(_path, (err, fileContent) => {
    if (!fileContent) {
      console.log("empty");
      console.log("error", err);
      console.log("fileContent", fileContent);
      cb([]);
    } else {
      console.log("not empty");
      console.log("error", err);
      console.log("fileContent", fileContent);
      cb(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(passedTitle) {
    this.title = passedTitle;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(_path, JSON.stringify(products), (err) => {
        console.log("HELLO");
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
