const bcrypt = require("bcryptjs");
const User = require("../models/user");

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

  await newUser.save();

  res.redirect("/login");
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

module.exports = { getLogin, postLogin, postLogout, getSignUp, postSignup };

// User.findOne().then() -- promises
// User.findOne({email}, (err,user) => {  ---- callback way

// })

// third and best way would be async await
