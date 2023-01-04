const isAuth = (req, res, next) => {
  console.log("authenticated middleware check");
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }

  next();
};

module.exports = { isAuth };
