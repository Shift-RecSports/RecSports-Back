const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const client = require("../config/database");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./images",
  filename: function (req, file, callback) {
    // Generate a unique filename
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});
// Create upload instance
const upload = multer({ storage: storage });


//GET all deportes
router.get("/", (req, res) => {
  client.query(`SELECT * FROM DEPORTES`, (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    
    return res.json(results.rows);
  });
});

//GET deporte by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`SELECT * FROM Deportes WHERE id = $1;`,[id], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Deporte no encontrado",
      });
    }
    return res.status(200).json(results.rows[0]);
  });
});

//POST new deporte
router.post("/", upload.single("imagen"), (req, res) => {
  const body = req.body;
  const filename = req.file.filename; // Retrieve the filename from the request
  client.query(
    `INSERT INTO Deportes (nombre, descripcion, materiales, imagen, duracion) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
    [body.nombre, body.descripcion, body.materiales, filename, body.duracion],
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

//UPDATE deporte
router.put("/", upload.single("imagen"), (req, res) => {
  const body = req.body;
  const filename = req.file.filename; // Retrieve the filename from the request
  client.query(
    `UPDATE Deportes SET nombre = $1, descripcion = $2, materiales = $3, imagen = $4, duracion = $5 WHERE id = $6 RETURNING *;`,
    [ body.nombre, body.descripcion, body.materiales,filename, body.duracion,body.id],
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


//DELETE deporte
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  client.query(  `WITH deleted_espacios AS (
    DELETE FROM Espacios
    WHERE deporte = $1
    RETURNING *
  )
  DELETE FROM Deportes
  WHERE id = $2;`,
  [id,id], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error conexion base de datos",
      });
    }
    return res.status(200).json({});
  });
});


module.exports = router;
