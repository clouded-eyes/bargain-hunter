const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegistration = async (req, res) => {
  res.render("users/register");
};
module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Bargain Hunter!");
      res.redirect("/products");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
};
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.authenticate = (req, res, next) => {
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  });
  next();
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/products";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Logged Out!");
  res.redirect("/products");
};
