const Product = require("../models/product");

const getIndex = async (req, res, next) => {
  try {
    const productList = await Product.getAllProducts();
    res.render("shop/index", {
      prods: productList,
      pageTitle: "All Products",
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const productList = await Product.getAllProducts();

    res.render("shop/product-list", {
      prods: productList,
      pageTitle: "Products",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

const getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);

  try {
    const product = await Product.getProductById(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
    console.log(product);
  } catch (err) {
    console.log(err);
  }
};

const getCart = async (req, res, next) => {
  const user = req.user;

  const cart = await user.getCart();

  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: cart,
  });
};

const addProductToCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user;

  try {
    const productToAdd = await Product.getProductById(prodId);

    await user.addToCart(productToAdd);

    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

const postCartDeleteProduct = async (req, res, next) => {
  const user = req.user;
  const prodId = req.body.productId;

  await user.deleteCartItem(prodId);

  res.redirect("/cart");
};

const createOrder = async (req, res, next) => {
  const user = req.user;

  await user.addOrder();

  res.redirect("/orders");
};

const getOrders = async (req, res, next) => {
  const user = req.user;

  const orders = await user.getUserOrders();

  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders: orders,
  });
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  addProductToCart,
  postCartDeleteProduct,
  getOrders,
  createOrder,
};
