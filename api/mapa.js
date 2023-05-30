const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const client = require("../config/database");
const fs = require("fs");


// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./imagenes/mapas",
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


// GET all mapas
router.get("/", (req, res) => {
  client.query(`SELECT * FROM Mapa`, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
    return res.status(200).json(results.rows);
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
  const id = req.body.id;
  const imagen = req.file ? req.file.filename : req.body.imagen;

  // Check if the received imagen parameter is a file
  if (req.file) {
    // Delete the previous image file of the specific mapa
    client.query(
      `SELECT imagen FROM Mapa WHERE id = $1`,
      [id],
      (err, results) => {
        if (err) {
          console.error("Mapa not found:", err);
          return res.status(500).json({ error: "Mapa not found" });
        }
        const previousImagen = results.rows[0].imagen;
        // Delete the previous image file
        const previousImagePath = path.join(__dirname, "../imagenes/mapas", previousImagen);
        fs.unlink(previousImagePath, (err) => {
          if (err) {
            console.error("Error deleting previous image:", err);
            return res.status(500).json({ error: "Failed to delete previous image from Mapa" });
          }
        });
      }
    );
  }

  // Update the mapa with the new image filename or with the same imagen string
  client.query(
    `UPDATE Mapa SET imagen = $1 WHERE id = $2 RETURNING *;`,
    [imagen, id],
    (err, result) => {
      if (err) {
        console.error("Error updating mapa:", err);
        return res.status(500).json({ error: "Failed to update mapa" });
      }
      return res.status(200).json(result.rows[0]);
    }
  );
});


// DELETE mapa
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  // Delete the mapa from the database and retrieve the deleted row
  client.query(
    `DELETE FROM Mapa WHERE id = $1 RETURNING *;`,
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting mapa:", err);
        return res.status(500).json({ error: "Failed to delete mapa" });
      }

      if (result.rows.length === 0) {
        // Mapa not found
        return res.status(404).json({ error: "Mapa not found" });
      }

      const imagen = result.rows[0].imagen;
      if (!imagen) {
        // No image associated with the Mapa
        return res.status(200).json({ message: "Mapa deleted successfully. No image to delete" });
      }

      // Delete the image file
      const imagePath = path.join(__dirname, "../imagenes/mapas", imagen);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
          return res.status(500).json({ error: "Failed to delete image" });
        }

        return res.status(200).json({ message: "Mapa and associated image deleted successfully" });
      });
    }
  );
});



module.exports = router;
