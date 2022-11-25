const Cart = require("../models/cart");
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

const getProductDetail = (req, res) => {
  Product.getProductById(req.params.id, (product) => {
    res.render("shop/product-detail", {
      pageTitle: "View Product",
      path: "/product-list",
      productDetails: product,
    });
  });
};

const getCartPage = (req, res) => {
  Cart.getCartItems((cart) => {
    res.render("shop/cart", {
      pageTitle: "My Cart",
      path: "/cart",
      items: cart.products,
    });
  });
};

const addToCart = (req, res) => {
  Product.getProductById(req.body.id, (product) => {
    Cart.addProduct(product.id, product.price);
  });

  res.redirect("/cart");
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
  addToCart,
  getProductDetail,
};
