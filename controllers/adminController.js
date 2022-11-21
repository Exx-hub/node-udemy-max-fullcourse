const Product = require("../models/product");

const getAddProductForm = (req, res) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

const addProduct = (req, res) => {
  const { title } = req.body;

  const newProduct = new Product(title);

  newProduct.save();

  res.redirect("/");
};

module.exports = { getAddProductForm, addProduct };
