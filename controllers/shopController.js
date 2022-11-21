const Product = require("../models/product");

const productsPage = (req, res) => {
  Product.fetchAll((productArr) => {
    res.render("shop", {
      pageTitle: "Shop.",
      prods: productArr,
      path: "/",
      hasProducts: productArr.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

module.exports = { productsPage };
