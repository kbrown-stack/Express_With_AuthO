const express = require("express");
const session = require("express-session");
const { requiresAuth } = require("express-openid-connect"); // This library is a middleware serving as passport auth md
const bodyParser = require("body-parser");
require("dotenv").config(); // This helps to have access to the enviroment variables through the mongoose database
const path = require("path");

const authOMiddleware = require("./auth/authO"); // This is middleware for AuthO required.

const PORT = 4040;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting up Sessions

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret", //
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to `true` in production with HTTPS
  })
);

// The set up EJS , as the View Engine

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // this is

// AuthO middleware config router below attaches  /login, /logout  and /callback routes to the base URL

app.use(authOMiddleware); // Middleware function
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Rendering the EJS files below

// req.isAuthenticated is provided from the auth router below.

app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // This shows users are readily available in the ejs files.
  next();
});

// Get Home Route
app.get("/", (req, res) => {
  res.render("index"); // Pass user to EJS
});

// Get Login Route
app.get("/login", (req, res) => {
  res.oidc.login({ returnTo: "/profile" }); // This redirects to login.ejs file
});

// Get profile Route

app.get("/profile", requiresAuth(), (req, res) => {
  console.log("User data:", req.oidc.user); // Debugging
  if (!req.oidc.user) {
    return res.redirect("/"); // Redirect if no user data
  }
  res.render("profile", { user: req.oidc.user });
});

// Get Logout Route

app.get("/logout", (req, res) => {
  res.oidc.logout({ returnTo: "/" }); // Redirects to home after logout
});

// Handling the erros
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server started successfully on PORT: http://localhost:${PORT}`);
});
