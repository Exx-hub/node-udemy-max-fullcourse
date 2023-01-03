const User = require("../models/user");

const getLogin = (req, res, next) => {
  res.render("auth/loginPage", {
    path: "/login",
    pageTitle: "Sign In",
    isAuthenticated: false,
  });
};

const postLogin = async (req, res, next) => {
  const user = await User.findById("63b11e6c23c02f1c35057228");

  // session
  req.session.user = user;
  req.session.isLoggedIn = true;
  // to ensure that session updates are done before redirecting. due to slow connection maybe
  await req.session.save();
  res.redirect("/");
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

module.exports = { getLogin, postLogin, postLogout };

// COOKIES

// one way to set request cookie
// res.setHeader("Set-Cookie", "loggedIn=true");

// better way
// res.cookie("isLoggedIn", true, {
// httpOnly: true, // accessible only by web server
// secure: true, // https
// sameSite: "None", // // cross-site cookie
// maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry set to match refresh token expiry
// });
