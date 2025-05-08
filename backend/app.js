const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require('./routes')

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.listen(3000, () => {
    console.log("Serwer działa");
})
// module.exports = app; // Zamiast app.listen() eksportujemy aplikację