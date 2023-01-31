const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

let config = {
  service: "gmail",
  auth: {
    user: "ragnarokmobile166@gmail.com",
    pass: "xgdyppiiuwjxlcmk",
  },
};

const transporter = nodemailer.createTransport(config);

const getLogin = (req, res, next) => {
  const message = req.flash("error");

  res.render("auth/loginPage", {
    path: "/login",
    pageTitle: "Sign In",
    errorMessage: message.length > 0 ? message[0] : null,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/loginPage", {
      path: "/login",
      pageTitle: "Sign In",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
      },
      validationErrors: errors.array(),
    });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).render("auth/loginPage", {
      path: "/login",
      pageTitle: "Sign In",
      errorMessage: "Email does not exists",
      oldInput: {
        email,
        password,
      },
      validationErrors: [{ param: "email" }],
    });
  }

  const verifiedPassword = await bcrypt.compare(password, user.password);

  if (!verifiedPassword) {
    return res.status(422).render("auth/loginPage", {
      path: "/login",
      pageTitle: "Sign In",
      errorMessage: "Incorrect Password",
      oldInput: {
        email,
        password,
      },
      validationErrors: [{ param: "password" }],
    });
  }

  // if able to reach here, save user in session.
  // session
  req.session.user = user;
  req.session.isLoggedIn = true;

  // to ensure that session updates are done before redirecting. due to slow connection maybe

  if (req.session.user) {
    res.redirect("/");
  }
};

const getSignUp = (req, res, next) => {
  const message = req.flash("error");
  res.render("auth/signUp", {
    path: "/signup",
    pageTitle: "Sign Up",
    errorMessage: message.length > 0 ? message[0] : null,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

const postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signUp", {
      path: "/signup",
      pageTitle: "Sign Up",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    return res.status(422).render("auth/signUp", {
      path: "/signup",
      pageTitle: "Sign Up",
      errorMessage: "Email already exists.",
      oldInput: {
        email,
        password,
        confirmPassword,
      },
      validationErrors: [{ param: "email" }],
    });
  }

  const passwordsMatch = password === confirmPassword;

  if (!passwordsMatch) {
    return res.status(422).render("auth/signUp", {
      path: "/signup",
      pageTitle: "Sign Up",
      errorMessage: "Passwords do not match.",
      oldInput: {
        email,
        password,
        confirmPassword,
      },
      validationErrors: [{ param: "password" }, { param: "confirmPassword" }],
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    cart: { items: [] },
  });

  let details = {
    from: "ragnarokmobile166@gmail.com",
    to: email,
    subject: "Signup with Shop",
    text: "Congratulations! You have successfully created an account. Happy shopping!",
  };

  try {
    await newUser.save();

    transporter.sendMail(details, (err) => {
      if (err) {
        console.log("Error sending mail!");
        console.log(err);
        return res.status(500).json(err);
      } else {
        console.log("Email sent successfully!.");
        return res.redirect("/login");
      }
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;

    return next(error);
  }
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("logout err:", err);
    res.redirect("/");
  });
};

const getReset = (req, res, next) => {
  const message = req.flash("error");
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

const postReset = async (req, res, next) => {
  const { email } = req.body;

  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      req.flash("error", "No account with that email found.");
      return res.redirect("/reset");
    }

    foundUser.resetToken = token;
    foundUser.resetTokenExpiration = Date.now() + 3600000;

    await foundUser.save();

    let details = {
      from: "ragnarokmobile166@gmail.com",
      to: email,
      subject: "Password reset link",
      html: `
      <p>You requested a password reset.</p>
      <p>Click this <a href="http://localhost:8080/updatePassword/${token}">link</a> to set a new password, expires in an hour.</p>
      `,
    };

    transporter.sendMail(details, (err) => {
      if (err) {
        console.log("err:", err);
        return res.status(500).json(err);
      } else {
        console.log("Password reset link sent successfully!.");
        return res.redirect("/login");
      }
    });
  });
};

const getUpdatePassword = async (req, res, next) => {
  const token = req.params.token;

  const foundUser = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!foundUser) {
    return res
      .status(422)
      .json({ message: "Invalid reset token / something went wrong." });
  }

  const message = req.flash("error");

  res.render("auth/updatePassword", {
    path: `/updatePassword`,
    pageTitle: "Update Password",
    errorMessage: message.length > 0 ? message[0] : null,
    userId: foundUser._id.toString(),
    token: token,
  });
};

const postUpdatePassword = async (req, res, next) => {
  const { userId } = req.body;
  const { token } = req.body;
  const newPassword = req.body.password;

  const foundUser = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });

  if (!foundUser) {
    return res
      .status(422)
      .json({ message: "Invalid reset token / something went wrong." });
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 12);

  foundUser.password = newHashedPassword;
  foundUser.resetToken = undefined;
  foundUser.resetTokenExpiration = undefined;

  try {
    await foundUser.save();
    res.redirect("/login");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;

    return next(error);
  }
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignup,
  getReset,
  postReset,
  getUpdatePassword,
  postUpdatePassword,
};
