const express = require("express");
const router = express.Router();
const client = require("../config/database");

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
  client.query(`SELECT r.*, e.zona, e.nombre as espacio_nombre, d.nombre as deporte_nombre, TO_CHAR(r.fecha, 'YYYY-MM-DD') AS fecha
  FROM Reservaciones r
  JOIN Espacios e ON r.espacio = e.id
  JOIN Deportes d ON e.deporte = d.id
  WHERE r.matricula_alumno = $1;`, [matricula], (error, results) => {
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
  client.query(`WITH RECURSIVE time_list AS (
    SELECT '06:00:00'::TIME AS hora_inicio, '07:00:00'::TIME AS hora_fin
    UNION ALL
    SELECT hora_inicio + INTERVAL '1 hour', hora_fin + INTERVAL '1 hour'
    FROM time_list
    WHERE hora_inicio < '22:00:00'::TIME
  )
  
  SELECT r.id, time_list.hora_inicio as hora_seleccionada, COALESCE(r.matricula_alumno, null) AS matricula_alumno, TO_CHAR(r.fecha, 'YYYY-MM-DD') AS fecha, r.espacio, COALESCE(r.estatus, 1) AS estatus
  FROM time_list
  LEFT JOIN (
    SELECT hora_seleccionada, id, matricula_alumno, fecha, espacio, estatus
    FROM Reservaciones
    WHERE fecha = $2
  ) AS r ON time_list.hora_inicio = r.hora_seleccionada
  LEFT JOIN Espacios AS e ON r.espacio = e.id AND e.deporte = $1
  ORDER BY time_list.hora_inicio;
  
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
router.post("/", (req, res) => {
  const body = req.body;
  client.query(
    `INSERT INTO Reservaciones (hora_seleccionada, matricula_alumno, fecha, espacio, estatus) VALUES ($1, $2, $3, $4, $5) RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.hora_seleccionada, body.matricula_alumno, body.fecha, body.espacio, body.estatus],
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
router.put("/", (req, res) => {
  const body = req.body;
  client.query(
    `UPDATE Reservaciones
    SET hora_seleccionada = $1, matricula_alumno = $2, fecha = $3, espacio = $4, estatus = $5 WHERE id = $6 RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
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
