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
    switch (req.body.genderInput) {
      case "male":
        req.body.gender = Gender.MALE;
        break;
      case "female":
        req.body.gender = Gender.FEMALE;
        break;
      case "other":
        req.body.gender = Gender.OTHER;
        break;
      default:
        throw new Error("Undefined gender submitted");
    }
  } catch (error) {
    console.log(error.message);
  }

  const options = utils.signup(req.body);

  if (options.user) {
    req.session.user = options.user;
    res.redirect("home");
  } else {
    res.render("signup");
  }
});

// @desc  Display user login form
// @route GET /login
app.get("/login", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.redirect("home");
  } else {
    res.render("login");
  }
});

// @desc  Attempt to login user with login form data
// @route POST /login
app.post("/login", (req, res) => {
  console.log("login request body: ", req.body);
  const options = utils.login(req.body);

  console.log("login options: ", options);
  if (options.user) {
    req.session.user = options.user;
    res.redirect("home");
  } else {
    res.render("login", options);
  }
});

// @desc User homepage that serves as a hub for accesing different user information. 
// @route GET /home
app.get("/home", (req, res) => {
  console.log("user is: ",req.session.user)
  if (!req.session.user) {
    res.redirect("login");
  } else {
    res.render("home", { user: req.session.user });
  }
});

// @desc  User profile page where user can see profile information
// @route GET /profile/:id
app.get("/profile/:id", (req, res) => {

})

// @desc  Request to change user profile information
// @route POST /profile/:id
app.post("/profile/:id", (req,res) => {

})

// @desc  User symptoms page. Displays daily trends and alerts when condition gets worse
// @route GET /symptoms/:id
app.get("/symptoms/:id", (req,res) => {

})

// @desc  Users can post thier vaccination status and their daily symptoms.
// @route POST /symptoms/:id
app.post("/symptoms/:id", (req,res) => {
  
})

// @desc  Logout current user from the session
// @route GET /logout
app.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}.`);
});
