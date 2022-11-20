const path = require("path");

const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin");

router.get("/", (req, res) => {
  // res.send("<h1>hello from express!</h1>");
  // console.log(adminRoutes.products);
  // res.sendFile(path.join(__dirname, "..", "views", "shop.html"));
  const products = adminRoutes.products;
  res.render("shop", {
    pageTitle: "Shop.",
    prods: products,
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
