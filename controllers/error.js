const get404 = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;

  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: isLoggedIn,
  });
};

const get500 = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;

  res.status(500).render("500", {
    pageTitle: "Something went wrong!",
    path: "/500",
    isAuthenticated: isLoggedIn,
  });
};

module.exports = { get404, get500 };
