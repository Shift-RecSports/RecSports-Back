const express = require("express");
const router = express.Router();
const client = require("../config/database");

//GET all registrosgimnasio
router.get("/", (req, res) => {
  client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM RegistrosGimnasio;`, (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    
    return res.json(results.rows);
  });
});

//GET registro gimnasio by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM RegistrosGimnasio WHERE id = $1;`,[id], (error, results, fields) => {
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

//POST new registro gimnasio
router.post("/", (req, res) => {
  const body = req.body;
  client.query(
    `INSERT INTO RegistrosGimnasio (matricula, entrada, salida, fecha) VALUES ($1, $2, $3, $4) RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
  [body.matricula, body.entrada, body.salida, body.fecha],
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

//UPDATE registro gimnasio
router.put("/", (req, res) => {
  const body = req.body;
  client.query(
    `UPDATE Historial SET num_semana = $1, fecha = TO_DATE($2, 'YYYY-MM-DD'), hora_inicio = $3, contador = $4, dia_semana = $5 WHERE id = $6 RETURNING *;`,
    [body.num_semana, body.fecha, body.hora_inicio, body.contador, body.dia_semana, body.id],
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


//DELETE registro gimnasio
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  client.query(  `DELETE FROM Historial WHERE id = $1`,
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
