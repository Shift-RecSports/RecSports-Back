const cron = require("node-cron");
const client = require("../config/database");





const runJobEvery15Minutes = () => {
// Programa una tarea que se ejecuta cada 15 minutos desde las 6 AM hasta las 11 PM.
const job = cron.schedule("*/15 6-23 * * *", () => {
    setGym90Checkout()
    
  });
};


const runJobEveryIntermediateHour = () => {
// Programa una tarea para que se ejecute a los 30 minutos de cada hora desde las 6 AM hasta las 11 PM todos los días.
const job = cron.schedule("30 6-23 * * *", () => {
    generateHistorialGimnasio()

  });

};


const runJobEveryExactHour = () => {
// Programa una tarea para que se ejecute al inicio de cada hora (minuto 0) desde las 6 PM hasta las 11 PM, todos los días.
  //   const job = cron.schedule("*/10 * * * * *", () => {

  const job = cron.schedule("0 6-23 * * *", () => {
    expirePassedReservations()
  });

};


//Genera un registro en una tabla de historial, capturando la fecha actual, hora actual, contador de registros de gimnasio y el día de la semana, y lo guarda en la base de datos para su posterior seguimiento y análisis.
function generateHistorialGimnasio() {
  client.query(`SELECT COUNT(*) AS total FROM RegistrosGimnasio WHERE fecha = CURRENT_DATE AT TIME ZONE 'CST' AND salida IS NULL;`, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      const contador = results.rows[0].total;
      const num_semana = getNumWeek()
      const today = new Date();
      const year = today.getFullYear(); // año actual
      const month = today.getMonth() + 1; //mes actual (los meses están indexados desde cero).
      const day = today.getDate(); // dia actual
      // fecha en formato "YYYY-MM-DD"
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
            console.log(`Registros Gimnasio Agregado a Historial ${fecha} ${hora_inicio} aforo: ${contador}`)
          }
        });
    }
  });
};

//Actualiza el estado de las reservaciones que han pasado su fecha y hora seleccionada, marcándolas como expiradas en la base de datos del gimnasio, y muestra un mensaje de registro en la consola indicando que las reservaciones expiradas han sido actualizadas.
function expirePassedReservations() {
  client.query(`UPDATE Reservaciones
  SET estatus = 3
  WHERE fecha < CURRENT_DATE AT TIME ZONE 'America/Monterrey' OR (fecha = CURRENT_DATE AT TIME ZONE 'America/Monterrey' AND hora_seleccionada < (CURRENT_TIME AT TIME ZONE 'America/Monterrey' - INTERVAL '1 HOUR'));
  `, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Reservaciones pasadas expiradas` )
    }
  });
};

//Marca la salida de los usuarios del gimnasio después de 90 minutos de haber entrado y no registraron su salida.
function setGym90Checkout() {
  client.query(`
    UPDATE RegistrosGimnasio
    SET salida = (SELECT current_time AT TIME ZONE 'America/Monterrey')
    WHERE salida IS NULL AND entrada < (SELECT current_time AT TIME ZONE 'America/Monterrey' - INTERVAL '90 minutes');
  `, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Salida marcada usuarios gimnasio +90 minutos`);
    }
  });
}


//Calcula el número de la semana actual dentro de un rango predefinido del semestre TEC, excluyendo ciertos días de la cuenta, y devuelve un valor entre 1 y 6 que representa la semana actual dentro de ese rango. El cálculo se basa en la diferencia de días entre una fecha de inicio y la fecha actual.
function getNumWeek() {
  const fechaInicio = new Date(2023, 1, 13); // Fecha de inicio del rango
  const fechaFin = new Date(2023, 5, 25); // Fecha de fin del rango
  const diasExcluidos = [ // Días excluidos del conteo
    new Date(2023, 3, 3),
    new Date(2023, 3, 4),
    new Date(2023, 3, 5),
    new Date(2023, 3, 6),
    new Date(2023, 3, 7),
    new Date(2023, 3, 8),
    new Date(2023, 3, 9),
  ];
  const today = new Date(); // Fecha actual
  const timeDiff = today.getTime() - fechaInicio.getTime(); // Diferencia de tiempo en milisegundos entre la fecha actual y la fecha de inicio
  const daysDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000)); // Obtener la diferencia en días enteros
  const daysCounted = Array.from( // Obtener todos los días contados, excluyendo los días de vacaciones
    { length: daysDiff + 1 },
    (_, i) => new Date(fechaInicio.getTime() + i * 24 * 60 * 60 * 1000)
  ).filter(
    (date) =>
      !diasExcluidos.some((d) => d.toDateString() === date.toDateString())
  );
  const weekNumber = Math.floor(daysCounted.length / 7) + 1; // Calcular el número de semana basado en la cantidad de días contados
  return ((weekNumber - 1) % 6) + 1; // Convertir el valor al rango de 1 a 6, volviendo a 1 si supera 6
};

module.exports = {  runJobEveryExactHour, runJobEveryIntermediateHour, runJobEvery15Minutes };