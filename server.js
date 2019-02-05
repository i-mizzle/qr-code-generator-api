const app = require('express')();
const passport = require('passport');

// Bootstrap schemas, models
require("./src/bootstrap");

// App configuration
require("./src/serverConfig")(app, passport);

// Add route
require("./src/config/route")(app, passport);

//listen on PORT
const server = app.listen(process.env.PORT || 3000, () => {
    console.log('process listening ON', process.env.PORT || 3000);
});


module.exports = server;