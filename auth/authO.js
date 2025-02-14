const { auth } = require("express-openid-connect");
require("dotenv").config();

const config = {
  authRequired: false, // Set to `true` to require authentication for all routes by default
  auth0Logout: true, // Logout redirects to Auth0 logout endpoint
  secret: process.env.AUTH0_SECRET, // A strong secret used to sign session cookies
  baseURL: process.env.AUTHO_BASE_URL, // Your app's base URL (e.g., http://localhost:4040)
  clientID: process.env.AUTH0_CLIENT_ID, // Your Auth0 application client ID
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL, // Your Auth0 domain (e.g., https://dev-rfh8nnxdzzyokkt3.uk.auth0.com)

  routes: {
    login: false, // just to handle the login route.
  },
};

module.exports = auth(config);
