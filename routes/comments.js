/** @format */

let express = require(`express`);
const comment = require("../models/comment");
let router = express.Router();
let Blog = require(`../models/blog`);
let Comment = require(`../models/comment`);
const blog = require("../models/blog");
const { rawListeners } = require("../models/comment");

//  like comment

router.get(`/:id/likes`, (req, res, next) => {
  let id = req.params.id;

  Comment.findByIdAndUpdate(id, { $inc: { like: 1 } })
    .populate(`blogId`)
    .exec((err, comment) => {
      if (err) return next(err);
      return res.redirect(`/blogs/` + comment.blogId.slug);
    });

  // Comment.findByIdAndUpdate(id, { $inc: { like: 1 } }, (err, comment) => {
  //   if (err) return next(err);
  //   // console.log(err, comment);
  //   return res.redirect(`/blogs/` + comment.blogId);
  // });
});

// dislikes comment

router.get(`/:id/dislikes`, (req, res, next) => {
  let id = req.params.id;

  Comment.findByIdAndUpdate(id, { $inc: { dislike: 1 } })
    .populate(`blogId`)
    .exec((err, comment) => {
      if (err) return next(err);
      // console.log(err, comment);
      return res.redirect(`/blogs/` + comment.blogId.slug);
    });
});

// edit comment
router.get(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;

  Comment.findById(id)
    .populate(`blogId`)
    .exec((err, comment) => {
      if (err) return next(err);
      return res.render(`commentEditForm`, { comment });
    });
  // Comment.findById(id, (err, comment) => {
  //   if (err) return next(err);
  //   return res.render(`commentEditForm`, { comment });
  // });
});

// update comment

router.post(`/:id/update`, (req, res, next) => {
  let id = req.params.id;

  Comment.findByIdAndUpdate(id, req.body)
    .populate(`blogId`)
    .exec((err, comment) => {
      if (err) {
        if (err.name === `ValidationError`) {
          req.flash(`msg`, err.message);
          return res.redirect(`/blogs/` + comment.blogId.slug);
        }
      } else {
        console.log(err, comment);
        return res.redirect(`/blogs/` + comment.blogId.slug);
      }
    });

  // Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
  //   if (err) {
  //     if (err.name === `ValidationError`) {
  //       req.flash(`msg`, err.message);
  //       return res.redirect(`/blogs/` + comment.bl);
  //     }
  //   } else {
  //     return res.redirect(`/blogs/` + comment.blogId);
  //   }
  // });
});

// delete comment

router.get(`/:id/delete`, (req, res, next) => {
  let id = req.params.id;

  Comment.findByIdAndDelete(id, (err, comment) => {
    if (err) return next(err);
    Blog.findByIdAndUpdate(
      comment.blogId,
      { $pull: { comments: comment.id } },
      (err, blog) => {
        if (err) return next(err);
        res.redirect(`/blogs/` + blog.slug);
      }
    );
  });
});
module.exports = router;
