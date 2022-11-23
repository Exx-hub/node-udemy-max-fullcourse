const Product = require("../models/product");

const getAddProductForm = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

const addProduct = (req, res) => {
  const { title, image, description, price } = req.body;

  console.log(req.body);
  const newProduct = new Product(title, image, description, price);

  newProduct.save();

  res.redirect("/admin/inventory");
};

const getInventory = (req, res) => {
  Product.fetchAll((productArr) => {
    res.render("admin/inventory", {
      pageTitle: "Shop.",
      prods: productArr,
      path: "/admin/inventory",
      hasProducts: productArr.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

const editProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
  });
};

module.exports = { getAddProductForm, addProduct, getInventory, editProduct };
