/** @format */

var User = require("../models/user");

module.exports = {
  loggedInUser: function (req, res, next) {
    // console.log(req.session.user.id, `uidONe`);
    if (req.session && req.session.passport) {
      next();
    } else {
      res.redirect("/users/login");
    }
  },
  userInfo: function (req, res, next) {
    var userId = req.session && req.session.passport;

    if (userId) {
      User.findById(userId.user, "firstName lastName email", (err, user) => {
        if (err) return next(err);
        req.user = user;

        res.locals.user = user;

        return next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      return next();
    }
  },
};
