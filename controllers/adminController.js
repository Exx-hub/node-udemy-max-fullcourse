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

  console.log("request body", req.body);
  const newProduct = new Product(title, image, description, price);

  newProduct.save();

  res.redirect("/admin/inventory");
};

const editProductPage = (req, res) => {
  Product.getProductById(req.params.id, (product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      product: product,
    });
  });
};

const editProduct = (req, res) => {
  const id = req.body.id;
  const itemDetails = req.body;
  Product.editItem(id, itemDetails);

  res.redirect("/admin/inventory");
};

const deleteItem = (req, res) => {
  const id = req.params.id;

  Product.delete(id);

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

module.exports = {
  getAddProductForm,
  addProduct,
  getInventory,
  editProductPage,
  deleteItem,
  editProduct,
};
