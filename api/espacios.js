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


//GET all espacios
router.get("/", (req, res) => {
  client.query(`SELECT * FROM ESPACIOS`, (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    
    return res.json(results.rows);
  });
});

//GET espacio by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`SELECT * FROM Espacios WHERE id = $1;`,[id], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Espacio no encontrado",
      });
    }
    return res.status(200).json(results.rows[0]);
  });
});

//POST new espacio
router.post("/", upload.single("imagen"), (req, res) => {
  const body = req.body;
  const filename = req.file.filename; // Retrieve the filename from the request
  client.query(
    `INSERT INTO Espacios (nombre, horarios, aforo, zona, imagen, deporte) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
  [body.nombre, body.horarios, body.aforo, body.zona, filename, body.deporte],
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
    `UPDATE Espacios SET nombre = $1, horarios = $2, aforo = $3, zona = $4, imagen = $5, deporte = $6 WHERE id = $7 RETURNING *;`,
    [body.nombre, body.horarios, body.aforo, body.zona, filename, body.deporte, body.id],
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


//DELETE espacio
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  client.query(  `DELETE FROM Espacios WHERE id = $1`,
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


module.exports = router;
