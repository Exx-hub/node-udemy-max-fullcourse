const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("test route intercepted");
  res.send("intercepted by test route");
});

module.exports = router;
