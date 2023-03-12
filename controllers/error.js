const get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", { myActivePath: "404-page", docTitle: "Page Not Found" });
  next();
};

module.exports = {
  get404,
};
