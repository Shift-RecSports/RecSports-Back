const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const deportesRouter = require("./api/deportes");
const espaciosRouter = require("./api/espacios");

// Middleware setup
app.use(express.json());
// Specify the directory where your static files are stored
app.use(express.static("images"));

// Routes
app.use("/api/deportes", deportesRouter);
app.use("/api/espacios", espaciosRouter);


app.listen(process.env.PORT, () => {
  console.log("Server is up and running on PORT:", process.env.PORT);
});
