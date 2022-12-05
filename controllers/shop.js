const Product = require("../models/product");

getProducts = async (req, res, next) => {
  try {
    const productList = await Product.findAll();
    res.render("shop/product-list", {
      prods: productList,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

getProduct = async (req, res, next) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findByPk(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

getIndex = async (req, res, next) => {
  try {
    const productList = await Product.findAll();
    res.render("shop/product-list", {
      prods: productList,
      pageTitle: "All Products",
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
};

getCart = async (req, res, next) => {
  const user = req.user;

  try {
    const cart = await user.getCart();

    const cartProducts = await cart.getProducts();
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cartProducts,
    });
  } catch (err) {
    console.log(err);
  }
};

addProductToCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user;

  try {
    const cart = await user.getCart(); // get the cart

    // get cart if item being added already exists
    const itemAlreadyInCart = await cart.getProducts({ where: { id: prodId } });

    let product; // initialize item to add or item to add quantity to
    let newQuantity = 1; // initialize a new quantity

    // if more than 0, meaning item already in cart.
    // set product to existing product, increase quantity
    if (itemAlreadyInCart.length > 0) {
      product = itemAlreadyInCart[0];
      newQuantity = product.cartItem.quantity + 1;
    } else {
      // if product not yet in cart, find product by ID and set it to product variable
      product = await Product.findByPk(prodId);
    }

    // add product to cart, either new product with added quantity propert,
    // or existing product with updated quantity
    const addToCart = await cart.addProduct(product, {
      through: { quantity: newQuantity },
    });

    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

postCartDeleteProduct = async (req, res, next) => {
  const user = req.user;
  const prodId = req.body.productId;

  const userCart = await user.getCart();

  const cartProducts = await userCart.getProducts({ where: { id: prodId } });

  const productToDelete = cartProducts[0];

  const deleteItem = await productToDelete.cartItem.destroy();

  res.redirect("/cart");
};

createOrder = async (req, res, next) => {
  const user = req.user;

  const userCart = await user.getCart();
  const cartItems = await userCart.getProducts();

  const createOrderTable = await user.createOrder();

  const itemsToTransferToOrder = cartItems.map((item) => {
    item.orderItem = {
      quantity: item.cartItem.quantity,
    };
    return item;
  });

  await createOrderTable.addProducts(itemsToTransferToOrder);

  await userCart.setProducts(null);

  res.redirect("/orders");
};

getOrders = async (req, res, next) => {
  const user = req.user;

  try {
    const orders = await user.getOrders({ include: ["products"] });
    console.log(orders);
    res.render("shop/orders", {
      path: "/order",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    console.log(err);
  }
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
