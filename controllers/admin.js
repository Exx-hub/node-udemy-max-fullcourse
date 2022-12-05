const Product = require("../models/product");

getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const userId = req.user.id;
  const user = req.user;

  try {
    // method automatically created by sequelize, becuase user and product is associated.
    const createdProduct = await user.createProduct({
      title,
      description,
      price,
      imageUrl,
    });

    console.log(createdProduct);
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

  // Product.create({
  //   title,
  //   description,
  //   price,
  //   imageUrl,
  //   userId,
  // })
  // .then((result) => {
  //   console.log("Created Product Success");
  //   res.redirect("/admin/products");
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
};

getEditProduct = async (req, res, next) => {
  const user = req.user;

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  try {
    const allProducts = await user.getProducts({ where: { id: prodId } });

    const product = allProducts[0];

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

  // Product.findByPk(prodId)
  // .then((products) => {
  //   const product = products[0];
  //   if (!product) {
  //     return res.redirect("/");
  //   }
  //   res.render("admin/edit-product", {
  //     pageTitle: "Edit Product",
  //     path: "/admin/edit-product",
  //     editing: editMode,
  //     product: product,
  //   });
  // })
  // .catch((err) => console.log(err));
};

postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  let productToEdit;

  try {
    productToEdit = await Product.findByPk(prodId);

    productToEdit.title = updatedTitle;
    productToEdit.imageUrl = updatedImageUrl;
    productToEdit.price = updatedPrice;
    productToEdit.description = updatedDesc;
  } catch (err) {
    console.log(err);
  }

  try {
    const savedProduct = await productToEdit.save();

    console.log(savedProduct);
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }

  // Product.findByPk(prodId)
  //   .then((product) => {
  //     product.title = updatedTitle;
  //     product.imageUrl = updatedImageUrl;
  //     product.price = updatedPrice;
  //     product.description = updatedDesc;
  //     return product.save();
  //   })
  //   .then((result) => {
  //     console.log("product updated");
  //     res.redirect("/admin/products");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

getProducts = async (req, res, next) => {
  const user = req.user;

  try {
    const products = await user.getProducts();

    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log(error);
  }
};

postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: prodId,
      },
    });

    console.log(deletedProduct);

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
  postDeleteProduct,
};
