const express = require("express");
const app = express();
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const User = require("./models/user");

mongoose.connect(
  "process.env.DATABASEURL",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("db rocks");
    }
  }
);
app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "deal breaker"
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, data) => {
      if (err) {
        console.log("err");
        res.redirect("/login");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/s");
      });
    }
  );
});
app.get("/un", isLogin, (req, res) => {
  res.render("uncommon", { req: req });
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/un",
    failureRedirect: "/login"
  }),
  (req, res) => {
    console.log("dummy post middleware");
  }
);

app.listen(3000, () => {
  console.log("server at 3000");
});
function isLogin(req, res, next) {
  if (req.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});
