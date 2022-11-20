const path = require("path");

const express = require("express");
const router = express.Router();

const products = [];

router.get("/add-product", (req, res) => {
  console.log("add route");
  console.log(path.join(__dirname, "views", "add-product.html"));
  console.log(__filename);
  console.log(__dirname);

  // res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
});

router.post("/add-product", (req, res) => {
  console.log(req.body);
  const { title } = req.body;

  products.push({ title });

  res.redirect("/");
});

module.exports = { router, products };
