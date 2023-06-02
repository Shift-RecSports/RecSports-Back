const express = require("express");
const router = express.Router();
const client = require("../config/database");
const multer = require("multer");
const upload = multer();


//GET all gimnasio
router.get("/", (req, res) => {
  client.query(`SELECT * FROM Gimnasio;`, 
  (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    
    return res.json(results.rows);
  });
});

//GET gimnasio by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`SELECT * FROM Gimnasio WHERE id = $1;`,[id], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Gimnasio no encontrado",
      });
    }
    return res.status(200).json(results.rows[0]);
  });
});

//POST new gimnasio
router.post("/",upload.single(), (req, res) => {
  const body = req.body;
  client.query(
    `INSERT INTO Gimnasio (dia_semana, hora_inicio, hora_fin, aforo)
    VALUES ($1, $2, $3, $4) RETURNING *; `,
  [body.dia_semana, body.hora_inicio, body.hora_fin, body.aforo],
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

// UPDATE gimnasio
router.put("/:id",upload.single(), (req, res) => {
  const id = req.params.id;
  const body = req.body;
  client.query(
    `UPDATE Gimnasio 
    SET dia_semana = $1, hora_inicio = $2, hora_fin = $3, aforo = $4
    WHERE id = $5 RETURNING *;`,
    [body.dia_semana, body.hora_inicio, body.hora_fin, body.aforo, id],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error respuesta de servidor",
        });
      } else {
        if (results.rowCount === 0) {
          return res.status(404).json({
            message: "No se encontró el gimnasio con el ID proporcionado",
          });
        } else {
          return res.status(200).json(results.rows[0]);
        }
      }
    }
  );
});


// DELETE gimnasio
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  client.query(
    `DELETE FROM Gimnasio 
    WHERE id = $1 RETURNING *;`,
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error respuesta de servidor",
        });
      } else {
        if (results.rowCount === 0) {
          return res.status(404).json({
            message: "No se encontró el gimnasio con el ID proporcionado",
          });
        } else {
          return res.status(200).json({});
        }
      }
    }
  );
});



module.exports = router;
