const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");

const utils = require("./utils/utils");
const { util } = require("chai");

dotenv.config();

const PORT = process.env.PORT || 5000;

// configure server
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: process.env.SECRET, saveUninitialized: true, resave: true })
);

// @desc  Redirect to appropriate page depending on user login status
// @route GET /
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
});

// @desc  Display user signup form
// @route GET /signup
app.get("/signup", (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("signup");
  }
});

// @desc  Attempt to register user with sign up form data
// @route POST /signup
app.post("/signup", (req, res) => {
  const formData = req.body;

  const options = utils.signup(req.body);

  if (options.user) {
    req.session.user = options.user;
    res.redirect("/home");
  } else {
    res.render("signup");
  }
});

// @desc  Display user login form
// @route GET /login
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("login");
  }
});

// @desc  Attempt to login user with login form data
// @route POST /login
app.post("/login", (req, res) => {
  const options = utils.login(req.body);

  if (options.user) {
    req.session.user = options.user;
    res.redirect("/home");
  } else {
    res.render("login", options);
  }
});

// @desc User homepage that serves as a hub for accesing different user information.
// @route GET /home
app.get("/home", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    res.render("home", { user: req.session.user });
  }
});

// @desc  User profile page where user can see profile information
// @route GET /profile/:id
app.get("/profile/:id", (req, res) => {
  if (req.session.user && req.params.id == req.session.user.id) {
    res.render("profile", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

// @desc  Request to change user profile information
// @route POST /profile/:id
app.post("/profile/:id", (req, res) => {
  if (req.session.user && req.params.id == req.session.user.id) {
    const { email, age } = req.body;

    req.session.user = utils.updateUserProfile(req.params.id, email, age);

    res.render("profile", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

// @desc  User symptoms page. Displays daily trends and alerts when condition gets worse
// @route GET /symptoms/:id
app.get("/symptoms/:id", (req, res) => {
  if (req.session.user && req.params.id == req.session.user.id) {
    res.render("symptoms", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

// @desc  Users can post thier vaccination status and their daily symptoms.
// @route POST /symptoms/:id
app.post("/symptoms/:id", (req, res) => {
  if (req.session.user && req.params.id == req.session.user.id) {
    // extract form data
    const {
      fever,
      dryCough,
      fatigue,
      lossOfTasteOrSmell,
      achesAndPains,
      breathingDifficulties,
      chestPainOrPressure,
    } = req.body;

    // calculate todays date
    const today = new Date();
    const date =
      today.getDate() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getFullYear();

    // create our syptoms object
    const symptoms = {
      date: date,
      fever: fever == "on" ? true : false,
      dryCough: dryCough == "on" ? true : false,
      fatigue: fatigue == "on" ? true : false,
      lossOfTasteOrSmell: lossOfTasteOrSmell == "on" ? true : false,
      achesAndPains: achesAndPains == "on" ? true : false,
      breathingDifficulties: breathingDifficulties == "on" ? true : false,
      chestPainOrPressure: chestPainOrPressure == "on" ? true : false,
    };

    req.session.user = utils.addUserSymptoms(req.params.id, symptoms);

    res.render("symptoms", {user: req.session.user});
  } else {
    res.redirect("/login");
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
