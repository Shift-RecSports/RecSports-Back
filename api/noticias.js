const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const client = require("../config/database");
const fs = require("fs");


// Establecer el motor de almacenamiento para multer
const storage = multer.diskStorage({
  destination: "./imagenes/noticias",
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


//GET all noticias
router.get("/", (req, res) => {
  client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM Noticias`, (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }

    return res.json(results.rows);
  });
});

//GET noticia by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM Noticias WHERE id = $1;`, [id], (error, results, fields) => {
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

//POST new noticia
router.post("/", upload.single("imagen"), (req, res) => {
  const body = req.body;
  const filename = req.file.filename;
  client.query(
    `INSERT INTO Noticias (lugar, fecha, hora, titulo, imagen, url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.lugar, body.fecha, body.hora, body.titulo, filename, body.url],
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

//UPDATE noticia
router.put("/", upload.single("imagen"), (req, res) => {
  const body = req.body;
  const imagen = req.file ? req.file.filename : req.body.imagen;
  // Check if the received imagen parameter is a file
  if (req.file) {
    // Delete the previous image file of the specific noticia
    client.query(
      `SELECT imagen FROM Noticias WHERE id = $1`,
      [body.id],
      (err, result) => {
        if (err) {
          console.error("Noticia not found:", err);
          return res.status(500).json({ error: "Noticia not found " });
        }
        const previousImagen = result.rows[0].imagen;
        console.log('previous image');
        console.log(previousImagen);
        // Delete the previous image file
        const previousImagePath = path.join(__dirname, "../imagenes/noticias", previousImagen);
        fs.unlink(previousImagePath, (err) => {
          if (err) {
            console.error("Error deleting previous imagen:", err);
            return res.status(500).json({ error: "Failed to delete previous image from Noticia" });
          }
        });
      }
    );
  } 
   // Update the noticia with the new image filename or with the same imagen string
   client.query(
    `UPDATE Noticias SET lugar = $1, fecha = $2, hora = $3, titulo = $4, imagen = $5, url = $6  WHERE id = $7 RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.lugar, body.fecha, body.hora, body.titulo, imagen, body.url, body.id],
    (err, result) => {
      if (err) {
        console.error("Error updating noticia:", err);
        return res.status(500).json({ error: "Failed to update noticia 3" });
      }
      return res.status(200).json(result.rows[0]);
    }
  );
  
});

//DELETE noticia
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  // Elimina la noticia de la base de datos y recupera la fila eliminada.
  client.query(
    `DELETE FROM Noticias WHERE id = $1 RETURNING *`,
    [id],
    (err, result) => {
      if (err) {
        console.error("Error elimando Noticia:", err);
        return res.status(500).json({ error: "Error borrando Noticia" });
      }

      if (result.rows.length === 0) {
        // Noticia no encontrada
        return res.status(404).json({ error: "Noticia no encontrada" });
      }

      const imagen = result.rows[0].imagen;
      if (!imagen) {
        // No imagen asociada con la noticia
        return res.status(200).json({ message: "Noticia eliminado correctamente. No hay imagen para eliminar." });
      }
      // Elimina el archivo de imagen
      const imagePath = path.join(__dirname, "../imagenes/noticias", imagen);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("No se pudo eliminar la imagen previa de Noticia.");
        }

        return res.status(200).json({ message: "Noticia y la imagen asociada eliminados correctamente." });
      });
    }
  );
});






module.exports = router;
