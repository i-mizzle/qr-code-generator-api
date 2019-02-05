const app = require('express')();
const passport = require('passport');

// Bootstrap schemas, models
require("./bootstrap");

// App configuration
require("./serverConfig")(app, passport);

// Add route
require("./config/route")(app, passport);

module.exports = app;