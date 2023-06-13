const cron = require("node-cron");
const client = require("../config/database");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

// const runJobEveryMinute = () => {
//   const job = cron.schedule("*/59 * * * * *", () => {

//   });

//   // Start the job
//   job.start();
// };


const runJobEveryHour = () => {
  //From 7 am to 
  const job = cron.schedule("0 19-23 * * *", () => {
    generateHistorialGimnasio()

  });

  // Start the job
  job.start();
};

// const runJobEveryDay = () => {
//   const job = cron.schedule("0 12 * * *", () => {
//     console.log("Running job every day at 12:00 PM");

//     // Get the current time in the Monterrey timezone
//     const now = moment().tz("America/Monterrey");

//     // Check if it's actually 12:00 PM in Monterrey
//     if (now.hour() === 12 && now.minute() === 0) {

//     }
//   });

//   // Start the job
//   job.start();
// };



function generateHistorialGimnasio() {

  //Obtain count of people that are currently in the gym
  client.query(`SELECT COUNT(*) AS total FROM RegistrosGimnasio WHERE fecha = CURRENT_DATE AT TIME ZONE 'CST' AND salida IS NULL;`, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      const contador = results.rows[0].total;
      const num_semana = getNumWeek()
      const today = new Date();
      const year = today.getFullYear(); // Get the current year
      const month = today.getMonth() + 1; // Get the current month (months are zero-indexed)
      const day = today.getDate(); // Get the current day
      // Format the date as "YYYY-MM-DD"
      const fecha = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const hora = today.getHours();
      const hora_inicio = hora.toString().padStart(2, '0') + ':00:00';
      const currentDate = new Date();
      const dia_semana = currentDate.getDay();
      client.query(
        `INSERT INTO Historial (num_semana, fecha, hora_inicio, contador, dia_semana)
    VALUES ($1, $2, $3, $4, $5) RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
        [num_semana, fecha, hora_inicio, contador, dia_semana], (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Registros Gimnasio Agregado a Historial ` + fecha + ' ' + hora_inicio )
          
          }
        });
    }
  });
};


//Return the number of the week of the TEC Semester depending on the current date
function getNumWeek() {
  const fechaInicio = new Date(2023, 1, 13);
  const fechaFin = new Date(2023, 5, 25);
  const diasExcluidos = [
    new Date(2023, 3, 3),
    new Date(2023, 3, 4),
    new Date(2023, 3, 5),
    new Date(2023, 3, 6),
    new Date(2023, 3, 7),
    new Date(2023, 3, 8),
    new Date(2023, 3, 9),
  ];
  const today = new Date();
  const timeDiff = today.getTime() - fechaInicio.getTime();
  const daysDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000)); // Get the difference in whole days
  const daysCounted = Array.from(
    { length: daysDiff + 1 },
    (_, i) => new Date(fechaInicio.getTime() + i * 24 * 60 * 60 * 1000)
  ).filter(
    (date) =>
      !diasExcluidos.some((d) => d.toDateString() === date.toDateString())
  ); // Get all the counted days, excluding the vacation days
  const weekNumber = Math.floor(daysCounted.length / 7) + 1; // Calculate the week number based on the number of counted days
  return ((weekNumber - 1) % 6) + 1;// Convert the value to the range of 1-6, looping back to 1 if it exceeds 6
};

//runJobEveryMinute, runJobEveryDay,
module.exports = {  runJobEveryHour};