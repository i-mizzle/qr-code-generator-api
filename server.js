
let app = require("./src/express");

const http = require('http');
app = http.createServer(app);
//listen on PORT
const server = app.listen(process.env.PORT || 3000, () => {
    console.log('process listening ON', process.env.PORT || 3000);
});

module.exports = server;