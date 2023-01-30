const express = require("express");

const authController = require("../controllers/auth");

const { check, body } = require("express-validator");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    check("email", "please enter a valid email.").isEmail(),
    body("password", "password should be at least 6 characters.").isLength({
      min: 6,
    }),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    check("email", "please enter a valid email.").isEmail(),
    body("password", "passwords should be at least 6 characters.").isLength({
      min: 6,
    }),
    // body("confirmPassword").custom((value, { req }) => {
    //   if (value !== req.body.password) {
    //     throw new Error("Passwords do not match.");
    //   }
    //   return true;
    // }),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/updatePassword/:token", authController.getUpdatePassword);
router.post("/updatePassword", authController.postUpdatePassword);

module.exports = router;
