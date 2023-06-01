const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const client = require("../config/database");
const fs = require("fs");


// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./imagenes/deportes",
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

// POST new deporte
router.post("/", upload.single("imagen"), (req, res) => {
  const body = req.body;
  const filename = req.file.filename;
  client.query(
    `INSERT INTO Deportes (nombre, descripcion, materiales, imagen, duracion)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`,
    [body.nombre, body.descripcion, body.materiales, filename, body.duracion],
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

// UPDATE deporte
router.put("/", upload.single("imagen"), (req, res) => {
  const body = req.body;
  const imagen = req.file ? req.file.filename : req.body.imagen;
  // Check if the received imagen parameter is a file
  if (req.file) {
    // Delete the previous image file of the specific deporte
    client.query(
      `SELECT imagen FROM Deportes WHERE id = $1`,
      [body.id],
      (err, result) => {
        if (err) {
          console.error("Deporte not found:", err);
          return res.status(500).json({ error: "Deporte not found" });
        }
        const previousImagen = result.rows[0].imagen;
        console.log('previous image');
        console.log(previousImagen);
        // Delete the previous image file
        const previousImagePath = path.join(__dirname, "../imagenes/deportes", previousImagen);
        fs.unlink(previousImagePath, (err) => {
          if (err) {
            console.error("Failed to delete previous image from Deporte");
          }
        });
      }
    );
  } 
   // Update the deporte with the new image filename or with the same imagen string
   client.query(
    `UPDATE Deportes SET nombre = $1, descripcion = $2, materiales = $3, imagen = $4, duracion = $5 WHERE id = $6 RETURNING *;`,
    [body.nombre, body.descripcion, body.materiales, imagen, body.duracion, body.id],
    (err, result) => {
      if (err) {
        console.error("Error updating deporte:", err);
        return res.status(500).json({ error: "Failed to update deporte" });
      }
      return res.status(200).json(result.rows[0]);
    }
  );
});

// DELETE deporte
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  // Delete the deporte from the database and retrieve the deleted row
  client.query(
    `DELETE FROM Deportes WHERE id = $1 RETURNING *;`,
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting deporte:", err);
        return res.status(500).json({ error: "Failed to delete deporte" });
      }

      if (result.rows.length === 0) {
        // Deporte not found
        return res.status(404).json({ error: "Deporte not found" });
      }

      const imagen = result.rows[0].imagen;
      if (!imagen) {
        // No image associated with the Deporte
        return res.status(200).json({ message: "Deporte deleted successfully. No image to delete" });
      }
      // Delete the image file
      const imagePath = path.join(__dirname, "../imagenes/deportes", imagen);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
          return res.status(500).json({ error: "Failed to delete image of Deporte" });
        }

        // Delete associated Espacios
        client.query(
          `DELETE FROM Espacios WHERE deporte = $1 RETURNING *;`,
          [id],
          (err, result) => {
            if (err) {
              console.error("Error deleting associated Espacios:", err);
              return res.status(500).json({ error: "Failed to delete associated Espacios" });
            }

            // Delete associated images of Espacios
            const espacios = result.rows;
            espacios.forEach((espacio) => {
              const espacioImagen = espacio.imagen;
              if (espacioImagen) {
                const espacioImagePath = path.join(__dirname, "../imagenes/espacios", espacioImagen);
                fs.unlink(espacioImagePath, (err) => {
                  if (err) {
                    console.error("Error deleting image of associated Espacio:", err);
                  }
                });
              }
            });

            return res.status(200).json({ message: "Deporte and associated Espacios deleted successfully" });
          }
        );
      });
    }
  );
});


module.exports = router;
