/** @format */

const { json } = require("express");
var express = require("express");
var router = express.Router();
var passport = require(`passport`);

const session = require("express-session");
const user = require("../models/user");
var passport = require(`passport`);

var User = require(`../models/user`);
const { route } = require("../app");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// register-form
router.get(`/register`, (req, res, next) => {
  let msg = req.flash(`msg`)[0];
  return res.render(`register`, { msg });
});

// login-form

router.get(`/login`, (req, res, next) => {
  let msg = req.flash(`error`)[0];
  return res.render(`login`, { msg });
});

// get user register

router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    // console.log(user);
    if (err) {
      if ((err.name = `ValidationError`)) {
        req.flash(`msg`, err.message);
        return res.redirect(`/users/register`);
      }
    }
    // console.log(err, user);
    return res.redirect(`/users/login`);
  });
});

// get user login

// router.post(`/login`, (req, res, next) => {
//   var { email, password } = req.body;
//   if (!email || !password) {
//     req.flash(`msg`, `email and password required`);
//     return res.redirect(`/users/login`);
//   }
//   User.findOne({ email }, (err, user) => {
//     if (err) return next(err);
//     // no user

//     if (!user) {
//       req.flash(`msg`, `user not registered`);
//       return res.redirect(`/users/login`);
//     }

//     // verify password

//     user.verifyPassword(password, (err, result) => {
//       if (err) return next(err);

//       // result as false

//       if (!result) {
//         req.flash(`msg`, `invalid password`);
//         return res.redirect(`/users/login`);
//       } else {
//         // persist session in database

//         req.session.userId = user.id;
//         // console.log(err, user);
//         // res.send(`partial/header.ejs`, { user });
//         return res.render(`dashboard`, { user });
//       }
//     });
//   });
// });

router.post(
  `/login`,
  passport.authenticate(`local`, {
    failureRedirect: `/users/login`,
    failureFlash: true,
    successRedirect: `/blogs`,
  })
);

// logout user

router.get(`/logout`, (req, res, next) => {
  req.session.destroy();
  res.clearCookie(`connect.sid`);
  return res.redirect(`/`);
});

module.exports = router;
