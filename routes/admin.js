const path = require("path");

const express = require("express");
const router = express.Router();

const {
  getAddProductForm,
  addProduct,
  getInventory,
  editProductPage,
  deleteItem,
  editProduct,
} = require("../controllers/adminController");

router.get("/add-product", getAddProductForm);

router.post("/add-product", addProduct);

router.get("/inventory", getInventory);

router.get("/edit-product/:id", editProductPage);
router.post("/edit-product/:id", editProduct);

router.post("/delete-item/:id", deleteItem);

module.exports = router;
