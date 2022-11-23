const express = require("express");
const router = express.Router();

const {
  getShopDashboard,
  productList,
  getCartPage,
  getCheckoutPage,
  getOrders,
} = require("../controllers/shopController");

router.get("/", getShopDashboard);

router.get("/product-list", productList);

router.get("/cart", getCartPage);

router.get("/orders", getOrders);

// router.get("/product-list/:productId", res.send("single product"));

router.get("/checkout", getCheckoutPage);

module.exports = router;
