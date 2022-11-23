const path = require("path");

const express = require("express");
const router = express.Router();

const {
  getAddProductForm,
  addProduct,
  getInventory,
  editProduct,
} = require("../controllers/adminController");

router.get("/add-product", getAddProductForm);

router.post("/add-product", addProduct);

router.get("/inventory", getInventory);

router.get("/edit-product", editProduct);

module.exports = router;
