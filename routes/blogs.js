/** @format */

let express = require(`express`);
let router = express.Router();
let moment = require(`moment`);
let Blog = require(`../models/blog`);
// const blog = require("../models/blog");
// const { loggedInUser } = require("../middleware/auth");
// const comment = require("../models/comment");
// const { rawListeners } = require("../models/comment");

let Comment = require(`../models/comment`);
let User = require(`../models/user`);

// add blog

router.get(`/new`, (req, res, next) => {
  let userId = req.session.passport;
  if (userId) {
    let msg = req.flash(`msg`)[0];
    return res.render(`blogForm`, { msg });
  } else {
    req.flash(`msg`, `you are not login`);
    return res.redirect(`/users/login`);
  }
  // console.log(msg);
});

// submit blog

router.post(`/new`, (req, res, next) => {
  // return res.json(err);

  Blog.create(req.body, (err, blog) => {
    if (err) {
      if (err.name === `ValidationError`) {
        req.flash(`msg`, err.message);
        return res.redirect(`/blogs/new`);
      }
      // return res.json(err);
    } else {
      return res.redirect(`/blogs`);
    }
  });
});

// edit blog

router.get(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;

  Blog.findById(id, (err, blog) => {
    if (err) return next(err);
    res.render(`editBlog`, { blog });
  });
});

// update blog

router.post(`/:id/update`, (req, res, next) => {
  let id = req.params.id;
  // let slug = req.params.slug;

  Blog.findByIdAndUpdate(id, req.body, { new: true }, (err, blog) => {
    if (err) return next(err);
    // console.log(err, blog);
    return res.redirect(`/blogs/` + blog.slug);
  });
});

// find all blogs

router.get(`/`, (req, res, next) => {
  let userId = req.session.passport;

  // console.log(req.session.passport.user, `bbb`);

  if (userId) {
    Blog.find({}, (err, blogs) => {
      if (err) {
        if ((err.name = `ValidationError`)) {
          req.flash(`msg`, err.message);
          return res.redirect(`/`);
        }
      } else {
        return res.render(`blogs`, { blogs });
      }
    });
  } else {
    req.flash(`msg`, `OOps! you are not login`);
    return res.redirect(`/`);
  }
});

// likes and dislike blog

router.get(`/:slug/likes`, (req, res, next) => {
  let slug = req.params.slug;

  Blog.findOneAndUpdate({ slug }, { $inc: { likes: 1 } }, (err, blog) => {
    if (err) return next(err);
    return res.redirect(`/blogs/` + slug);
  });
});

// dislikes

router.get(`/:slug/dislikes`, (req, res, next) => {
  // let id = req.params.id;
  let slug = req.params.slug;

  Blog.findOneAndUpdate({ slug }, { $inc: { dislikes: 1 } }, (err, blog) => {
    if (err) return next(err);
    return res.redirect(`/blogs/` + slug);
  });
});

// comments

router.post(`/:id/comment`, (req, res, next) => {
  let id = req.params.id;
  req.body.blogId = id;
  Comment.create(req.body, (err, comment) => {
    // console.log(err, comment);
    if (err) {
      if (err.name === `ValidationError`) {
        Blog.findById(id, (err, blog) => {
          if (err) return next(err);
          req.flash(`msg`, `name/comment validation failed`);
          return res.redirect(`/blogs/` + blog.slug);
        });
      }
    } else {
      let commentId = comment.id;
      Blog.findByIdAndUpdate(
        id,
        { $push: { comments: commentId } },
        (err, blog) => {
          if (err) return next(err);
          // console.log(blog);
          res.redirect(`/blogs/` + blog.slug);
        }
      );
    }
  });
});

// delete blog

router.get(`/:id/delete`, (req, res, next) => {
  // let slug = req.params.slug;
  let id = req.params.id;

  Blog.findByIdAndDelete(id, (err, blog) => {
    if (err) return next(err);
    Comment.deleteMany({ blogId: blog._id }, (err, comment) => {
      if (err) return next(err);

      res.redirect(`/blogs`);
    });
  });
});

// find single blog

router.get(`/:slug`, (req, res, next) => {
  let slug = req.params.slug;
  let cmtError = req.flash(`msg`)[0];
  Blog.findOne({ slug })
    .populate(`comments`)
    .exec((err, blog) => {
      if (err) return next(err);

      // console.log(blog);

      return res.render(`blog`, { blog, cmtError });
    });
});

module.exports = router;
