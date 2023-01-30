const bcrypt = require("bcryptjs");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
  });
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "Email does not exists");
    return res.redirect("/login");
  }

  const verifiedPassword = await bcrypt.compare(password, user.password);

  if (!verifiedPassword) {
    req.flash("error", "Incorrect password");
    return res.redirect("/login");
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
  });
};

const postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    req.flash("error", "Email already exist");
    return res.redirect("/signup");
  }

  const passwordsMatch = password === confirmPassword;

  if (!passwordsMatch) {
    req.flash("error", "Password mismatch");
    return res.redirect("/signup");
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
    return res.status(500).json({ message: "Failed to signup" });
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
    console.log(err);
    res.status(500).json(err);
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
