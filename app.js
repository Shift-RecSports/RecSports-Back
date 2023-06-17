const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const deportesRouter = require("./api/deportes");
const espaciosRouter = require("./api/espacios");
const historialRouter = require("./api/historial");
const registroGimnasioRouter = require("./api/registros-gimnasio");
const reservacionesRouter = require("./api/reservaciones");
const gimnasioRouter = require("./api/gimnasio");
const usuariosRouter = require("./api/usuarios");
const noticiasRouter = require("./api/noticias");
const mapaRouter = require("./api/mapa");
const encuestasRouter = require("./api/encuestas");
 const { runJobEveryExactHour, runJobEveryIntermediateHour, runJobEvery15Minutes } = require("./api/scheduled_jobs");



// Middleware setup
app.use(express.json());
// Especifica el directorio donde se almacenan tus archivos estáticos
app.use(express.static("imagenes"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
 next();
});

// Rutas
app.use("/api/deportes", deportesRouter);
app.use("/api/espacios", espaciosRouter);
app.use("/api/historial", historialRouter);
app.use("/api/registros-gimnasio", registroGimnasioRouter);
app.use("/api/reservaciones", reservacionesRouter);
app.use("/api/gimnasio", gimnasioRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/noticias", noticiasRouter);
app.use("/api/mapa", mapaRouter);
app.use("/api/encuestas", encuestasRouter);



// Scheduled jobs (funciones automatizadas y programadas)
runJobEveryExactHour();//Cada hora
runJobEveryIntermediateHour(); //A los 30 minutos de cada hora
runJobEvery15Minutes(); //Cada 15 minutos

app.listen(process.env.PORT, () => {
  console.log("Servidor esta corriendo en el PUERTO:", process.env.PORT);
});
