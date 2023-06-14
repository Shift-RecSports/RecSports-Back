const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const client = require("../config/database");
const fs = require("fs");


// Establecer el motor de almacenamiento para multer
const storage = multer.diskStorage({
  destination: "./imagenes/mapas",
  filename: function (req, file, callback) {
    // Generar un nombre de archivo único
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});
// Crear una instancia de carga
const upload = multer({ storage: storage });


// GET  mapa
router.get("/", (req, res) => {
  client.query(`SELECT * FROM Mapa LIMIT 1`, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
    return res.status(200).json(results.rows[0]);
  });
});

// POST new mapa
router.post("/", upload.single("imagen"), (req, res) => {
  const filename = req.file.filename;
  client.query(
    `INSERT INTO Mapa (imagen)
    VALUES ($1)
    RETURNING *;`,
    [filename],
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

// UPDATE mapa
router.put("/", upload.single("imagen"), (req, res) => {
  let imagen = req.file ? req.file.filename : req.body.imagen;
  // Verifica si el parámetro de imagen recibido es un archivo.
  if (req.file) {
    // Elimina el archivo de imagen anterior del mapa específico.
    client.query(
      `SELECT imagen FROM Mapa WHERE id = 1`,
      (err, results) => {
        if (err) {
          console.error("Mapa not found:", err);
          return res.status(500).json({ error: "Mapa not found" });
        }
        const previousImagen = results.rows[0].imagen;
        // Elimina el archivo de imagen anterior.
        const previousImagePath = path.join(__dirname, "../imagenes/mapas", previousImagen);
        fs.unlink(previousImagePath, (err) => {
          if (err) {
            console.error("Error deleting previous image:", err);
          }
        });
      }
    );
  }

  // Actualiza el mapa con el nombre de archivo de la nueva imagen o con la misma cadena de imagen.
  client.query(
    `UPDATE Mapa SET imagen = $1 WHERE id = 1 RETURNING *;`,
    [imagen],
    (err, result) => {
      if (err) {
        console.error("Error updating mapa:", err);
        return res.status(500).json({ error: "Failed to update mapa" });
      }
      else {
        return res.status(200).json(result.rows[0]);
      }
    }
  );
});


// DELETE mapa
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  // Elimina el mapa de la base de datos y recupera la fila eliminada.
  client.query(
    `DELETE FROM Mapa WHERE id = $1 RETURNING *;`,
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting mapa:", err);
        return res.status(500).json({ error: "Error al borrar el mapa" });
      }

      if (result.rows.length === 0) {
        // Mapa no encontrado
        return res.status(404).json({ error: "Mapa no encontrado" });
      }

      const imagen = result.rows[0].imagen;
      if (!imagen) {
        // No image associated with the Mapa
        return res.status(200).json({ message: "Mapa eliminado correctamente. No hay imagen para eliminar." });
      }

      // Delete the image file
      const imagePath = path.join(__dirname, "../imagenes/mapas", imagen);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error eliminado imagen", err);
          return res.status(500).json({ error: "No se pudo eliminar la imagen."
        });
        }

        return res.status(200).json({ message: "Mapa y la imagen asociada eliminados correctamente." });
      });
    }
  );
});



module.exports = router;
