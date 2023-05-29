const express = require("express");
const router = express.Router();
const client = require("../config/database");

//GET all historial
router.get("/", (req, res) => {
  client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM Historial;`, (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    
    return res.json(results.rows);
  });
});

//GET historial by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM Historial WHERE id = $1;`,[id], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Historial no encontrado",
      });
    }
    return res.status(200).json(results.rows[0]);
  });
});

//POST new historial
router.post("/", (req, res) => {
  const body = req.body;
  client.query(
    `INSERT INTO Historial (num_semana, fecha, hora_inicio, contador, dia_semana)
VALUES ($1, $2, $3, $4, $5) RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
  [body.num_semana, body.fecha, body.hora_inicio, body.contador, body.dia_semana],
    (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Error respuesta de servidor",
          });
        } else {
          return res.status(200).json(results.rows[0]);
        }
      }
    );
});

//UPDATE historial
router.put("/", (req, res) => {
  const body = req.body;
  client.query(
    `UPDATE Historial SET num_semana = $1, fecha = TO_DATE($2, 'YYYY-MM-DD'), hora_inicio = $3, contador = $4, dia_semana = $5 WHERE id = $6 RETURNING *;`,
    [body.num_semana, body.fecha, body.hora_inicio, body.contador, body.dia_semana, body.id],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error responding from the server",
        });
      } else {
        return res.status(200).json(results.rows[0]);
      }
    }
  );
  
});

//DELETE historial
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  client.query(  `DELETE FROM Historial WHERE id = $1`,
  [id], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error conexion base de datos",
      });
    }
    return res.status(200).json({});
  });
});

router.get("/concurrencias-aforo-gimnasio/:num_semana/:dia_semana",  (req, res) => {
  const { num_semana, dia_semana } = req.params;
  client.query(  `
  WITH reservation_times AS (
    SELECT generate_series(
             '2023-05-30 07:00:00'::timestamp,
             '2023-05-30 10:00:00'::timestamp,
             '1 hour'::interval
           ) AS reservation_time
  )
  SELECT reservation_times.reservation_time
  FROM reservation_times
  LEFT JOIN Reservaciones ON (
    Reservaciones.fecha = '2023-05-29'::date
    AND Reservaciones.hora_seleccionada = reservation_times.reservation_time::time
    AND Reservaciones.espacio = 'f8e443ec-5d1f-48dd-9916-d7f7eafc88fd'
  )
  WHERE Reservaciones.id IS NULL;
  

`,
[num_semana, dia_semana], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error conexion base de datos",
      });
    }
    return res.status(200).json(results.rows);
  });
});




module.exports = router;
