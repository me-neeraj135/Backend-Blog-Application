/** @format */

var express = require("express");
var router = express.Router();
var Blog = require(`../models/blog`);

/* GET home page. */
router.get("/", function (req, res, next) {
  let msg = req.flash(`msg`)[0];
  res.render("home", { msg });
});

module.exports = router;
