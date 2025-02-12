const express = require("express");
const { requiresAuth } = require('express-openid-connect'); // This library is a middleware serving as passport auth md
const bodyParser = require("body-parser");
require("dotenv").config(); // This helps to have access to the enviroment variables through the mongoose database

const authOMiddleware = require('./auth/authO')  // This is middleware for AuthO required.


const PORT = 4040;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// The set up EJS , as the View Engine

app.set("views", "views");
app.set("view engine", "ejs"); // this is

// Auth router below attaches  /login, /logout  and /callback routes to the base URL

app.use(authOMiddleware); // Middleware function

//Rendering the EJS files below

// req.isAuthenticated is provided from the auth router below. 

// Get Home/Index Route , which is the index

app.get("/", (req, res) => {
  res.render("index", {
    user: req.oidc.user,
  });
});

// Get profile Route


app.get("/profile", requiresAuth(), (req, res) => {
    console.log(req.oidc.user); // Verify that user data exists
    res.render("profile", {
        user: req.oidc.user,
    });
});


app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server started successfully on PORT: http://localhost:${PORT}`);
});
