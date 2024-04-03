/** @format */

var sassMiddleware = require("node-sass-middleware");
var cookieParser = require("cookie-parser");
var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
var path = require("path");
var moment = require(`moment`);
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var blogsRouter = require(`./routes/blogs`);
var commentRouter = require(`./routes/comments`);
var authRouter = require(`./routes/auth`);

var mongoose = require(`mongoose`);
var MongoStore = require(`connect-mongo`);
var session = require(`express-session`);
var flash = require(`connect-flash`);
var passport = require(`passport`);
require(`dotenv`).config();
var database = process.env.DATABASE_URL;

// connect database

var auth = require("./middleware/auth");

mongoose.connect(
  database,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log(err ? err : `database connected`);
  }
);
require(`./modules/passport`);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

// add session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: database }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
// add flash

app.use(flash());

// route

app.use(auth.userInfo);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(`/blogs`, blogsRouter);
app.use(`/comments`, commentRouter);
app.use(`/auth`, authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
