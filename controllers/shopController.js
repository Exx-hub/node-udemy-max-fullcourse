const Product = require("../models/product");

const getShopDashboard = (req, res) => {
  res.render("shop/index", {
    pageTitle: "Home",
    path: "/",
  });
};

const productList = (req, res) => {
  Product.fetchAll((productArr) => {
    res.render("shop/product-list", {
      pageTitle: "Shop.",
      prods: productArr,
      path: "/product-list",
      hasProducts: productArr.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

const getCartPage = (req, res) => {
  res.render("shop/cart", {
    pageTitle: "My Cart",
    path: "/cart",
  });
};
const getOrders = (req, res) => {
  res.render("shop/orders", {
    pageTitle: "My Orders",
    path: "/orders",
  });
};

const getCheckoutPage = (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

module.exports = {
  getShopDashboard,
  productList,
  getCartPage,
  getCheckoutPage,
  getOrders,
};
