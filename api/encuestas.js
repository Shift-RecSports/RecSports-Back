const express = require("express");
const router = express.Router();
const client = require("../config/database");
const multer = require("multer");
const upload = multer();


//GET all encuestas
router.get("/", (req, res) => {
    client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM encuestas;`, (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error respuesta de servidor",
        });
      }
    
      return res.json(results.rows);
    });
  });

  //GET average of all encuestas
router.get("/promedios", (req, res) => {
  client.query(`SELECT
  ROUND(AVG(calificacion1)::numeric, 1) AS promedio1,
  ROUND(AVG(calificacion2)::numeric, 1) AS promedio2,
  ROUND(AVG(calificacion3)::numeric, 1) AS promedio3
FROM Encuestas;`, (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
  
    return res.json(results.rows[0]);
  });
});

//GET encuestas by Id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM encuestas WHERE id = $1;`,[id], (error, results, fields) => {
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

//POST new encuesta
router.post("/",upload.single(), (req, res) => {
    const body = req.body;
    console.log(body)
    client.query(
      `INSERT INTO Encuestas (matricula, fecha, calificacion1, calificacion2, calificacion3, tema, comentario)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.matricula, body.fecha, body.calificacion1, body.calificacion2, body.calificacion3, body.tema, body.comentario],
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


//UPDATE encuesta
router.put("/",upload.single(), (req, res) => {
    const body = req.body;
    client.query(
      `UPDATE encuestas SET matricula = $1, fecha = TO_DATE($2, 'YYYY-MM-DD'), calificacion1 = $3, 
      calificacion2 = $4, calificacion3 = $5, tema = $6, comentario = $7 WHERE id = $8 RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
      [body.matricula, body.fecha, body.calificacion1, body.calificacion2, body.calificacion3, body.tema, body.comentario, body.id],
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


//DELETE encuesta
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    client.query(`DELETE FROM Encuestas WHERE id = $1`,
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