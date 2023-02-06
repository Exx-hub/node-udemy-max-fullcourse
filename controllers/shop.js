const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Order = require("../models/order");
const Product = require("../models/product");

const getIndex = async (req, res, next) => {
  // const cookies = req.cookies;
  // console.log("cookies", cookies);
  // console.log("view cookies without cookieparser:", req.get("Cookie"))

  try {
    const productList = await Product.find({});
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
    const productList = await Product.find({});

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

  try {
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

const getCart = async (req, res, next) => {
  const user = req.user;

  // console.log("user", user);

  // this is saying, go an transforms productIds stored in cart.items into full product object using productid
  // so productIds, become real product object, productIds served as reference to real products
  const populatedUser = await user.populate("cart.items.productId");

  const cart = populatedUser.cart.items;

  // // console.log(cart);

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
    const productToAdd = await Product.findById(prodId);

    await user.addToCart(productToAdd);

    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

const postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  const user = req.user;

  await user.removeFromCart(prodId);

  res.redirect("/cart");
};

const createOrder = async (req, res, next) => {
  const user = req.user;

  const populatedUser = await user.populate("cart.items.productId");

  // console.log(populatedUser);

  const userCart = populatedUser.cart.items.map((i) => {
    return {
      quantity: i.quantity,
      product: { ...i.productId._doc },
    };
  });

  const order = new Order({
    user: {
      email: req.user.email,
      userId: user._id,
    },
    products: userCart,
  });

  await order.save();
  await user.clearCart();

  res.redirect("/orders");
};

const getOrders = async (req, res, next) => {
  const user = req.user;

  const orders = await Order.find({ "user.userId": user._id });
  // console.log(orders);

  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders: orders,
  });
};

const getHardcodedInvoiceExample = async (req, res, next) => {
  const user = req.user;
  const { orderId } = req.params;

  // find order in db to get a hold of userId referenced in order
  // then check userid in order if same sa req.user which is logged in user.
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new Error("No order found."));
  }

  if (order.user.userId.toString() !== user._id.toString()) {
    return next(new Error("Unauthorized download."));
  }

  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("data", "invoices", invoiceName);
  console.log(invoicePath);

  // fs.readFile(invoicePath, (err, data) => {
  //   if (err) return next(err);

  //   res.setHeader("Content-Type", "application/pdf");
  //   res.setHeader("Content-Disposition", 'attachment; filename="' + invoiceName + '"  ');
  //   res.send(data);
  // });

  const file = fs.createReadStream(invoicePath);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="' + invoiceName + '"  ');

  file.pipe(res);
};

const getInvoice = async (req, res, next) => {
  const user = req.user;
  const { orderId } = req.params;

  const orderItem = await Order.findById(orderId);

  if (!orderItem) {
    return next(new Error("No order found."));
  }

  if (orderItem.user.userId.toString() !== user._id.toString()) {
    return next(new Error("Unauthorized download."));
  }

  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("data", "invoices", invoiceName);
  console.log(invoicePath);

  const pdfDoc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="' + invoiceName + '"  ');

  pdfDoc.pipe(fs.createWriteStream(invoicePath)); // save in your file system data/invoices
  pdfDoc.pipe(res); // serve in client with response

  pdfDoc.fontSize(26).text("Order Invoice", {
    underline: true,
  });

  let totalPrice = 0;

  orderItem.products.forEach((item) => {
    totalPrice = totalPrice + item.quantity * item.product.price;
    pdfDoc
      .fontSize(14)
      .text(item.product.title + " - " + item.quantity + " x " + "$" + item.product.price);
  });

  pdfDoc.text("------");
  pdfDoc.fontSize(20).text("Total Price: $ " + totalPrice);

  pdfDoc.end();
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
  getInvoice,
};
