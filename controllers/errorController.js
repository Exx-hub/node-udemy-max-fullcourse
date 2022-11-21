const serve404 = (req, res) => {
  res.status(404);
  res.render("404", { pageTitle: "Page Not Found", path: "" });
};

module.exports = serve404;
