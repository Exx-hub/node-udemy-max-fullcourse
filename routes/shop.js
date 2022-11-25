const express = require("express");
const router = express.Router();

const {
  getShopDashboard,
  productList,
  getCartPage,
  getCheckoutPage,
  getOrders,
  addToCart,
  getProductDetail,
} = require("../controllers/shopController");

router.get("/", getShopDashboard);

router.get("/product-list", productList);

router.get("/product-detail/:id", getProductDetail);

router.get("/cart", getCartPage);

router.post("/cart", addToCart);

router.get("/orders", getOrders);

router.get("/checkout", getCheckoutPage);

module.exports = router;
