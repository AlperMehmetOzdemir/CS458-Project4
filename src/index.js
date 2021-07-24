const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");

const utils = require("./utils/utils");
const { util } = require("chai");

dotenv.config();

const PORT = process.env.PORT || 5000;

// configure server
const app = express();
app.set("view enginer", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: process.env.SECRET, saveUninitialized: true, resave: true })
);

const Gender = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
};

// @desc  Redirect to appropriate page depending on user login status
// @route GET /
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("home");
  } else {
    res.redirect("login");
  }
});

// @desc  Display user signup form
// @route GET /signup
app.get("/signup", (req, res) => {
  if (req.session.user) {
    res.redirect("home");
  } else {
    res.render("signup");
  }
});

// @desc  Attempt to register user with sign up form data
// @route POST /signup
app.post("/signup", (req, res) => {
  try {
    switch (req.body.gender) {
      case "Male":
        req.body.gender = Gender.MALE;
        break;
      case "Female":
        req.body.gender = Gender.FEMALE;
        break;
      case "Other":
        req.body.gender = Gender.OTHER;
        break;
      default:
        throw new Error("Undefined gender submitted");
    }
  } catch (error) {
    console.log(error.message);
  }

  const options = utils.signup(req.body);

  if (options.user){
    req.session.user = options.user;
    res.redirect("home")
  } else {
    res.render("signup")
  }
});

// @desc  Display user login form
// @route GET /login
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("home");
  } else {
    res.render("signup");
  }
});

// @desc  Attempt to login user with login form data
// @route POST /login
app.post("/login", (req, res) => {
  const options = utils.login(req.body);

  if (options.user) {
    req.session.user = options.user;
    res.redirect("home");
  } else {
    res.render("login", options);
  }
});

// @desc User homepage with all their saved information
// @route GET /home
app.get("/home", (req, res) => {
  if (!req.session.user) {
    res.redirect("login");
  } else {
    res.render("home", { user: req.session.user });
  }
});

// @desc  Logout current user from the session
// @route GET /logout
app.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}.`);
});
