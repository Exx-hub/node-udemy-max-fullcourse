const express = require("express");
const router = express.Router();

const { productsPage } = require("../controllers/shopController");

router.get("/", productsPage);

module.exports = router;
