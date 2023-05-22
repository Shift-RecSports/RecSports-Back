const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const deportesRouter = require("./api/deportes");
const espaciosRouter = require("./api/espacios");
const historialRouter = require("./api/historial");
const registroGimnasioRouter = require("./api/registros-gimnasio");
const gimnasioRouter = require("./api/gimnasio");
const usuariosRouter = require("./api/usuarios");
const noticiasRouter = require("./api/usuarios");





// Middleware setup
app.use(express.json());
// Specify the directory where your static files are stored
app.use(express.static("images"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

// Routes
app.use("/api/deportes", deportesRouter);
app.use("/api/espacios", espaciosRouter);
app.use("/api/historial", historialRouter);
app.use("/api/registros-gimnasio", registroGimnasioRouter);
app.use("/api/gimnasio", gimnasioRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/noticias", noticiasRouter);




app.listen(process.env.PORT, () => {
  console.log("Server is up and running on PORT:", process.env.PORT);
});
