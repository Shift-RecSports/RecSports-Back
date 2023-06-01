const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const client = require("../config/database");
const fs = require("fs");


// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./imagenes/espacios",
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

// GET espacios by deporte
router.get("/deporte/:id", (req, res) => {
  const id = req.params.id;
  client.query(
    `SELECT * FROM Espacios WHERE deporte = $1;`,
    [id],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error en la respuesta del servidor",
        });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({
          message: "No se encontraron espacios para el deporte especificado",
        });
      }
      return res.status(200).json(results.rows);
    }
  );
});

// POST new espacio
router.post("/", upload.single("imagen"), (req, res) => {
  const body = req.body;
  const filename = req.file.filename;
  client.query(
    `INSERT INTO Espacios (nombre, horarios, aforo, zona, imagen, deporte)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;`,
    [body.nombre, body.horarios, body.aforo, body.zona, filename, body.deporte],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Server error",
        });
      } else {
        return res.status(200).json(results.rows[0]);
      }
    }
  );
});

// UPDATE espacio
router.put("/", upload.single("imagen"), (req, res) => {
  const body = req.body;
  const imagen = req.file ? req.file.filename : req.body.imagen;
  // Check if the received imagen parameter is a file
  if (req.file) {
    // Delete the previous image file of the specific espacio
    client.query(
      `SELECT imagen FROM Espacios WHERE id = $1`,
      [body.id],
      (err, result) => {
        if (err) {
          console.error("Espacio not found:", err);
          return res.status(500).json({ error: "Espacio not found " });
        }
        const previousImagen = result.rows[0].imagen;
        // Delete the previous image file
        const previousImagePath = path.join(__dirname, "../imagenes/espacios", previousImagen);
        fs.unlink(previousImagePath, (err) => {
          if (err) {
            console.error("Failed to delete previous image from Espacio");
          
          }
        });
      }
    );
  } 
   // Update the espacio with the new image filename or with the same imagen string
   client.query(
    `UPDATE Espacios SET nombre = $1, horarios = $2, aforo = $3, zona = $4, imagen = $5, deporte = $6  WHERE id = $7 RETURNING *;`,
    [body.nombre, body.horarios, body.aforo, body.zona, imagen, body.deporte, body.id],
    (err, result) => {
      if (err) {
        console.error("Error updating espacio:", err);
        return res.status(500).json({ error: "Failed to update espacio" });
      }
      return res.status(200).json(result.rows[0]);
    }
  );
});

// DELETE espacio
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  // Delete the espacio from the database and retrieve the deleted row
  client.query(
    `DELETE FROM Espacios WHERE id = $1 RETURNING *;`,
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting espacio:", err);
        return res.status(500).json({ error: "Failed to delete espacio" });
      }

      if (result.rows.length === 0) {
        // Espacio not found
        return res.status(404).json({ error: "Espacio not found" });
      }

      const imagen = result.rows[0].imagen;
      if (!imagen) {
        // No image associated with the Espacio
        return res.status(200).json({ message: "Espacio deleted successfully. No image to delete" });
      }
      // Delete the image file
      const imagePath = path.join(__dirname, "../imagenes/espacios", imagen);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
          return res.status(500).json({ error: "Failed to delete image" });
        }

        return res.status(200).json({ message: "Espacio and associated image deleted successfully" });
      });
    }
  );
});



module.exports = router;




