const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const deportesRouter = require("./api/deportes/deportes.router");

// Middleware setup
app.use(express.json());

// Routes
app.use("/api/deportes", deportesRouter);

app.listen(process.env.APP_PORT, () => {
  console.log("Server is up and running on PORT:", process.env.APP_PORT);
});
