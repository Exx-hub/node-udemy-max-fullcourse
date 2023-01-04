const Product = require("../models/product");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    // .populate("userId");

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

  // one way find product first then edit then save
  // const productToEdit = await Product.findById(prodId);

  // productToEdit.title = updatedTitle;
  // productToEdit.price = updatedPrice;
  // productToEdit.imageUrl = updatedImageUrl;
  // productToEdit.description = updatedDesc;

  // const result = await productToEdit.save();

  // for me this is a better way
  const updatedProduct = {
    title: updatedTitle,
    price: updatedPrice,
    description: updatedDesc,
    imageUrl: updatedImageUrl,
  };

  const result = await Product.findByIdAndUpdate(prodId, updatedProduct);

  console.log("result", result);

  res.redirect("/admin/products");
};

const deleteProductById = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    // const result = await Product.deleteOne({ _id: prodId });
    const result = await Product.findByIdAndDelete(prodId);

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
