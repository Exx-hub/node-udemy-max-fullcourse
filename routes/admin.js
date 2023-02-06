const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const { isAuth } = require("../middleware/isAuth");
const { body } = require("express-validator");

const router = express.Router();

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// // /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// // /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/delete-product", isAuth, adminController.deleteProductById);

module.exports = router;
