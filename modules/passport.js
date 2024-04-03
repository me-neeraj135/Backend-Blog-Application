/** @format */

var passport = require(`passport`);
var gitHubStrategy = require(`passport-github2`).Strategy;
var googleStrategy = require(`passport-google-oauth20`).Strategy;
var LocalStrategy = require(`passport-local`);

var User = require(`../models/user`);

// github strategy

passport.use(
  new gitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      var githubUser = {
        email: profile._json.email,
        firstName: profile._json.name.split(` `)[0],
        lastName: profile._json.name.split(` `)[1],
        providers: [profile.provider],
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return cb(err, false);

        if (!user) {
          User.create(githubUser, (err, newUser) => {
            if (err) return cb(err, false);

            cb(null, newUser);
          });
        } else {
          if (user.providers.includes(profile.provider)) {
            return cb(null, user);
          } else {
            user.providers.push(profile.provider);
            user.githubUser = { ...githubUser };
            user.save((err, addedUser) => {
              if (err) return cb(err, false);
              cb(null, addedUser);
            });
          }
        }
      });
    }
  )
);

// google Strategy

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      var googleUser = {
        email: profile._json.email,
        firstName: profile._json.name.split(` `)[0],
        lastName: profile._json.name.split(` `)[1],
        providers: profile.provider,
      };
      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);

        if (!user) {
          User.create(googleUser, (err, newUser) => {
            if (err) return done(err);

            done(null, newUser);
          });
        } else {
          if (user.providers.includes(profile.provider)) {
            done(null, user);
          } else {
            user.providers.push(profile.provider);
            user.googleUser = { ...googleUser };
            user.save((err, addedUser) => {
              if (err) return done(err);
              done(null, addedUser);
            });
          }
        }
      });
    }
  )
);

// local strategy

passport.use(
  new LocalStrategy(
    {
      usernameField: `email`,
      passwordField: `password`,
    },
    function (username, password, done) {
      User.findOne({ email: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            type: `msg`,
            message: `email/password is required`,
          });
        }

        user.verifyPassword(password, (err, result) => {
          if (err) return done(err, false);
          if (!result) {
            return done(err, false);
          }

          done(null, user);
        });
      });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, "name email username", (err, user) => {
    cb(err, user);
  });
});
