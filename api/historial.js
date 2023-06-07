const express = require("express");
const router = express.Router();
const client = require("../config/database");
const multer = require("multer");
const upload = multer();


//GET all historial
router.get("/", (req, res) => {
  client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM Historial;`, (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    
    return res.json(results.rows);
  });
});

//GET historial by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM Historial WHERE id = $1;`,[id], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Historial no encontrado",
      });
    }
    return res.status(200).json(results.rows[0]);
  });
});

//POST new historial
router.post("/",upload.single(), (req, res) => {
  const body = req.body;
  client.query(
    `INSERT INTO Historial (num_semana, fecha, hora_inicio, contador, dia_semana)
VALUES ($1, $2, $3, $4, $5) RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
  [body.num_semana, body.fecha, body.hora_inicio, body.contador, body.dia_semana],
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

//UPDATE historial
router.put("/",upload.single(), (req, res) => {
  const body = req.body;
  client.query(
    `UPDATE Historial SET num_semana = $1, fecha = TO_DATE($2, 'YYYY-MM-DD'), hora_inicio = $3, contador = $4, dia_semana = $5 WHERE id = $6 RETURNING *;`,
    [body.num_semana, body.fecha, body.hora_inicio, body.contador, body.dia_semana, body.id],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error en respuesta de servidor",
        });
      } else {
        return res.status(200).json(results.rows[0]);
      }
    }
  );
  
});

//DELETE historial
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

router.get("/concurrencias-aforo-gimnasio/:num_semana/:dia_semana",  (req, res) => {
  const { num_semana, dia_semana } = req.params;
  client.query(  `
  WITH RECURSIVE time_list AS (
    SELECT '06:00'::TIME AS hora_inicio, '07:00'::TIME AS hora_fin
    UNION ALL
    SELECT hora_inicio + INTERVAL '1 hour', hora_fin + INTERVAL '1 hour'
    FROM time_list
    WHERE hora_inicio < '21:00'::TIME
)
SELECT 
    time_list.hora_inicio,
    time_list.hora_fin,
    ROUND(COALESCE(AVG(historial.contador), 0)) AS historico,
    CASE 
        WHEN (EXTRACT(HOUR FROM CURRENT_TIMESTAMP AT TIME ZONE 'America/Monterrey') || ':00')::TIME = time_list.hora_inicio
            THEN (SELECT COUNT(*) FROM RegistrosGimnasio WHERE salida IS NULL) 
        ELSE 0
    END AS actual
FROM time_list
LEFT JOIN Historial historial 
    ON time_list.hora_inicio = historial.hora_inicio
    AND num_semana = $1
    AND dia_semana = $2
GROUP BY time_list.hora_inicio, time_list.hora_fin
ORDER BY time_list.hora_inicio ASC;

`,
[num_semana, dia_semana], (error, results, fields) => {
   if (error) {
     console.log(error);
     return res.status(500).json({
       message: "Error conexion base de datos",
     });
   }
   return res.status(200).json(results.rows);
 });
});




module.exports = router;
