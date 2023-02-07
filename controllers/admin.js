const { validationResult } = require("express-validator");
const Product = require("../models/product");
const deleteFile = require("../util/fileHelper");

const getProducts = async (req, res, next) => {
  const user = req.user;

  try {
    const products = await Product.find({ userId: user._id });

    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postAddProduct = async (req, res, next) => {
  const userId = req.user._id;
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  console.log(image);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
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
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const uploadedImage = req.file;
  const user = req.user;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    const productToEdit = await Product.findById(prodId);

    if (productToEdit.userId.toString() !== user._id.toString()) {
      return res.redirect("/");
    }

    productToEdit.title = updatedTitle;
    productToEdit.price = updatedPrice;
    productToEdit.description = updatedDesc;

    if (uploadedImage) {
      deleteFile(productToEdit.imageUrl);
      productToEdit.imageUrl = uploadedImage.path;
    }

    await productToEdit.save();
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;

    return next(error);
  }
};

const deleteProductById = async (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user;

  const product = await Product.findById(prodId);

  if (!product) {
    return next(new Error("Product not found."));
  }

  try {
    const result = await Product.deleteOne({ _id: prodId, userId: user._id });

    deleteFile(product.imageUrl);

    console.log("result", result);
    // res.redirect("/admin/products");
    res.send("Delete success");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const deleteProductClientside = async (req, res, next) => {
  const user = req.user;
  const prodId = req.params.productId;

  const product = await Product.findById(prodId);

  if (!product) {
    return next(new Error("Product not found."));
  }

  try {
    const result = await Product.deleteOne({ _id: prodId, userId: user._id });

    deleteFile(product.imageUrl);

    console.log("result", result);
    // res.redirect("/admin/products");
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Delete product failed" });
  }
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getProducts,
  deleteProductById,
  deleteProductClientside,
};
