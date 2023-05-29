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
    `INSERT INTO Reservaciones (hora_seleccionada, matricula_alumno, fecha, espacio, estatus) VALUES ($1, $2, $3, $4, $5) RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha 
    RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
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
