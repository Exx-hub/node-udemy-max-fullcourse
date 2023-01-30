const Product = require("../models/product");

const getProducts = async (req, res, next) => {
  const user = req.user;

  try {
    const products = await Product.find({ userId: user._id });

    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log(error);
  }
};

const postAddProduct = async (req, res, next) => {
  const userId = req.user._id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  console.log(userId);

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId,
  });

  try {
    const result = await product.save();

    console.log("result", result);

    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);

    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log("ERROR:", err);
  }
};

const postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const user = req.user;

  // one way find product first then edit then save
  // can also use findByIdAndUpdate and pass id and updated object
  const productToEdit = await Product.findById(prodId);

  if (productToEdit.userId.toString() !== user._id.toString()) {
    return res.redirect("/");
  }

  productToEdit.title = updatedTitle;
  productToEdit.price = updatedPrice;
  productToEdit.imageUrl = updatedImageUrl;
  productToEdit.description = updatedDesc;

  const result = await productToEdit.save();

  console.log("result", result);

  res.redirect("/admin/products");
};

const deleteProductById = async (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user;
  try {
    const result = await Product.deleteOne({ _id: prodId, userId: user._id });

    console.log("result", result);
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getProducts,
  deleteProductById,
};
