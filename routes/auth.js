/** @format */

var express = require(`express`);
var router = express.Router();

var passport = require(`passport`);

// github route

router.get(`/github`, passport.authenticate(`github`));

router.get(
  `/github/callback`,
  passport.authenticate(`github`, { failureRedirect: `/users/login` }),
  function (req, res) {
    res.redirect(`/blogs`);
  }
);

// google route

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile email"],
  })
);

router.get(
  `/google/callback`,
  passport.authenticate(`google`, { failureRedirect: `/users/login` }),
  function (req, res) {
    res.redirect(`/blogs`);
  }
);

module.exports = router;
