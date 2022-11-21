const path = require("path");

const express = require("express");
const router = express.Router();

const {
  getAddProductForm,
  addProduct,
} = require("../controllers/adminController");

router.get("/add-product", getAddProductForm);

router.post("/add-product", addProduct);

module.exports = router;
