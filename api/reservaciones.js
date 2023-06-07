const express = require("express");
const router = express.Router();
const client = require("../config/database");
const multer = require("multer");
const upload = multer();


// GET all reservaciones
router.get("/", (req, res) => {
  client.query(`SELECT Reservaciones.*, Espacios.zona, Espacios.nombre AS espacio_nombre, Deportes.nombre AS deporte_nombre, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha
  FROM Reservaciones
  JOIN Espacios ON Reservaciones.espacio = Espacios.id
  JOIN Deportes ON Espacios.deporte = Deportes.id;`, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error responding from the server",
      });
    }
    return res.json(results.rows);
  });
});

// GET reservacion by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`SELECT r.*, e.zona, e.nombre AS espacio_nombre, d.nombre AS deporte_nombre, TO_CHAR(r.fecha, 'YYYY-MM-DD') AS fecha
  FROM Reservaciones r
  JOIN Espacios e ON r.espacio = e.id
  JOIN Deportes d ON e.deporte = d.id
  WHERE r.id = $1;`, [id], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error responding from the server",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Reservacion not found",
      });
    }
    return res.status(200).json(results.rows[0]);
  });
});

// GET reservaciones by matricula
router.get("/matricula/:matricula", (req, res) => {
  const matricula = req.params.matricula;
  client.query(`SELECT r.*, e.zona, e.nombre as espacio_nombre, d.nombre as deporte_nombre,d.materiales, TO_CHAR(r.fecha, 'YYYY-MM-DD') AS fecha, e.imagen
  FROM Reservaciones r
  JOIN Espacios e ON r.espacio = e.id
  JOIN Deportes d ON e.deporte = d.id
  WHERE r.matricula_alumno = $1
  ORDER BY r.fecha, r.hora_seleccionada;`, [matricula], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error responding from the server",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Reservacion not found",
      });
    }
    return res.status(200).json(results.rows);
  });
});


// GET reservaciones by deporte by fecha
router.get("/deporte=:deporte/fecha=:fecha", (req, res) => {
  const deporte = req.params.deporte;
  const fecha = req.params.fecha;
  client.query(`
  WITH RECURSIVE time_list AS (
    SELECT '06:00:00'::TIME AS hora_inicio, '07:00:00'::TIME AS hora_fin
    UNION ALL
    SELECT hora_inicio + INTERVAL '1 hour', hora_fin + INTERVAL '1 hour'
    FROM time_list
    WHERE hora_inicio < '21:00:00'::TIME
), espacio_list AS (
    SELECT id,zona,nombre
    FROM Espacios
    WHERE deporte = $1
)
SELECT
    reservaciones.id,
    time_list.hora_inicio AS hora_seleccionada,
    reservaciones.matricula_alumno,
    COALESCE(TO_CHAR(reservaciones.fecha, 'YYYY-MM-DD'), $2::TEXT) AS fecha,
    espacio_list.id AS espacio,
    CASE 
        WHEN (time_list.hora_inicio <= (EXTRACT(HOUR FROM CURRENT_TIMESTAMP AT TIME ZONE 'America/Monterrey') || ':00')::TIME AND $2 = (CURRENT_DATE AT TIME ZONE 'America/Monterrey'))
            THEN 3 
        ELSE COALESCE(reservaciones.estatus, 1)
    END AS estatus,
    COALESCE(espacio_list.zona, espacios.zona) AS zona,
    COALESCE(espacio_list.nombre,  espacios.nombre) AS espacio_nombre
FROM time_list
CROSS JOIN espacio_list
LEFT JOIN Reservaciones reservaciones ON time_list.hora_inicio = reservaciones.hora_seleccionada
    AND (reservaciones.fecha = $2 OR reservaciones.fecha IS NULL)
    AND reservaciones.espacio = espacio_list.id
LEFT JOIN Espacios espacios ON reservaciones.espacio = espacios.id
LEFT JOIN Deportes deportes ON espacios.deporte = deportes.id
ORDER BY espacio_list.id, time_list.hora_inicio ASC;
  
`, [deporte,fecha], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error responding from the server",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Reservaciones no fueron encontradas",
      });
    }
    return res.status(200).json(results.rows);
  });
});


// POST new reservacion
router.post("/",upload.single(), (req, res) => {
  const body = req.body;
  client.query(
    `INSERT INTO Reservaciones (hora_seleccionada, matricula_alumno, fecha, espacio, estatus) VALUES ($1, $2, $3, $4, $5) RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.hora_seleccionada, body.matricula_alumno, body.fecha, body.espacio, 2],
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

// UPDATE reservacion
router.put("/",upload.single(), (req, res) => {
  const body = req.body;
  client.query(
    `UPDATE Reservaciones
    SET hora_seleccionada = $1, matricula_alumno = $2, fecha = $3, espacio = $4, estatus = $5 WHERE id = $6 
    RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.hora_seleccionada, body.matricula_alumno, body.fecha, body.espacio, body.estatus, body.id],
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

// DELETE reservacion
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`DELETE FROM Reservaciones WHERE id = $1`, [id], (error) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error responding from the server",
      });
    }
    return res.status(200).json({});
  });
});

module.exports = router;






// GET reservaciones by deporte by fecha ANTES DE CAMBIOS DE ESTATUS 3 Expirado por fecha y hora

// WITH RECURSIVE time_list AS (
//   SELECT '06:00:00'::TIME AS hora_inicio, '07:00:00'::TIME AS hora_fin
//   UNION ALL
//   SELECT hora_inicio + INTERVAL '1 hour', hora_fin + INTERVAL '1 hour'
//   FROM time_list
//   WHERE hora_inicio < '21:00:00'::TIME
// ), espacio_list AS (
//   SELECT id,zona,nombre
//   FROM Espacios
//   WHERE deporte = $1
// )
// SELECT
//   reservaciones.id,
//   time_list.hora_inicio AS hora_seleccionada,
//   reservaciones.matricula_alumno,
//   COALESCE(TO_CHAR(reservaciones.fecha, 'YYYY-MM-DD'), $2::TEXT) AS fecha,
//   espacio_list.id AS espacio,
//   COALESCE(reservaciones.estatus, 1) AS estatus,
//   COALESCE(espacio_list.zona, espacios.zona) AS zona,
//   COALESCE(espacio_list.nombre,  espacios.nombre) AS espacio_nombre
// FROM time_list
// CROSS JOIN espacio_list
// LEFT JOIN Reservaciones reservaciones ON time_list.hora_inicio = reservaciones.hora_seleccionada
//   AND (reservaciones.fecha = $2 OR reservaciones.fecha IS NULL)
//   AND reservaciones.espacio = espacio_list.id
// LEFT JOIN Espacios espacios ON reservaciones.espacio = espacios.id
// LEFT JOIN Deportes deportes ON espacios.deporte = deportes.id
// ORDER BY espacio_list.id, time_list.hora_inicio ASC;