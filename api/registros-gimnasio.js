const express = require("express");
const router = express.Router();
const client = require("../config/database");
const multer = require("multer");
const upload = multer();

//GET all registrosgimnasio
router.get("/", (req, res) => {
  client.query(
    `SELECT rg.id,rg.matricula, u.nombre, rg.entrada, rg.salida, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha
    FROM RegistrosGimnasio rg
    LEFT JOIN Usuarios u ON rg.matricula = u.matricula
    ;`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error respuesta de servidor",
        });
      }

      return res.json(results.rows);
    }
  );
});

//GET registro gimnasio by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  client.query(
    `SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM RegistrosGimnasio WHERE id = $1;`,
    [id],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error respuesta de servidor",
        });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({
          message: "Registro no encontrado",
        });
      }
      return res.status(200).json(results.rows[0]);
    }
  );
});

//GET registro gimnasio by Fecha
//Seleccionar registros de gimnasio que coincidan con la fecha proporcionada, ordenándolos por la hora de entrada y aplicando un desplazamiento (offset) y límite (limit) para paginación. 
router.get("/fecha=:fecha/offset=:offset", (req, res) => {
  const fecha = req.params.fecha;
  const offset = req.params.offset;
  client.query(
    `SELECT rg.id,rg.matricula, u.nombre, rg.entrada, rg.salida, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha
  FROM RegistrosGimnasio rg
  JOIN Usuarios u ON rg.matricula = u.matricula
  WHERE rg.fecha = $1
  ORDER BY rg.entrada DESC
  OFFSET $2
  LIMIT 50;
  `,
    [fecha, offset],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error respuesta de servidor",
        });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({
          message: "Registros no encontrados",
        });
      }
      return res.status(200).json(results.rows);
    }
  );
});

//GET aforo actual gimnasio
//Recuento actual de personas en un gimnasio y el límite de capacidad establecido para el día de la semana actual
router.get("/aforo/actual", (req, res) => {
  client.query(
    `SELECT COUNT(*) AS actual, COALESCE((SELECT aforo FROM Gimnasio WHERE dia_semana = EXTRACT(DOW FROM CURRENT_DATE)::INTEGER LIMIT 1), 0) AS aforo
FROM RegistrosGimnasio rg
WHERE rg.salida IS NULL AND fecha = CURRENT_DATE;`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error respuesta de servidor",
        });
      }
      return res.json(results.rows[0]);
    }
  );
});

//POST new registro gimnasio
router.post("/", upload.single(), (req, res) => {
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

//POST new registro gimnasio with only Matricula
router.post("/matricula", upload.single(), (req, res) => {
  const body = req.body;

  client.query(`SELECT u.matricula, u.nombre, tu.tipo FROM Usuarios u JOIN TipoUsuario tu ON u.tipo = tu.id WHERE matricula = $1;`,[body.matricula], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Matricula no válida",
      });
    }
    client.query(
      `INSERT INTO RegistrosGimnasio (matricula, entrada, salida, fecha)
       SELECT $1, CURRENT_TIME::time, NULL, CURRENT_DATE
       WHERE NOT EXISTS (
         SELECT 1 FROM RegistrosGimnasio
         WHERE matricula = $1 AND salida IS NULL
       )
       RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
      [body.matricula],
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Error respuesta de servidor",
          });
        } else {
          if (results.rowCount === 0) {
            return res.status(409).json({
              message: "Alumno ya registrado",
            });
          }
          return res.status(200).json(results.rows[0]);
        }
      }
    );
  });
  
});

//UPDATE registro gimnasio
router.put("/", upload.single(), (req, res) => {
  const body = req.body;
  client.query(
    `UPDATE RegistrosGimnasio
    SET matricula = $1, entrada = $2, salida = $3,  fecha = $4 WHERE id = $5 RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.matricula, body.entrada, body.salida, body.fecha, body.id],
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

//UPDATE registro gimnasio con solo Matricula
router.put("/matricula", upload.single(), (req, res) => {
  const body = req.body;
  client.query(
    `UPDATE RegistrosGimnasio
    SET salida = CURRENT_TIME ::time
    WHERE matricula = $1
      AND salida IS NULL
    RETURNING *,
      TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.matricula],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error respuesta de servidor",
        });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({
          message: "Matricula no válida",
        });
      }
       else {
        return res.status(200).json(results.rows[0]);
      }
    }
  );
});

//DELETE registro gimnasio
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  client.query(
    `DELETE FROM RegistrosGimnasio WHERE id = $1`,
    [id],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error conexion base de datos",
        });
      }
      return res.status(200).json({});
    }
  );
});

module.exports = router;
