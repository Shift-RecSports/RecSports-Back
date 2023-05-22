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
  client.query(`SELECT *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM RegistrosGimnasio WHERE id = $1;`, [id], (error, results, fields) => {
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
  });
});

//GET registro gimnasio by Fecha
router.get("/fecha=:fecha/offset=:offset", (req, res) => {
  const fecha = req.params.fecha;
  const offset = req.params.offset;
  client.query(`SELECT rg.id,rg.matricula, u.nombre, rg.entrada, rg.salida, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha
  FROM RegistrosGimnasio rg
  JOIN Usuarios u ON rg.matricula = u.matricula
  WHERE rg.fecha = $1
  OFFSET $2
  LIMIT 50;
  `, [fecha, offset],
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
    });
});

//GET aforo actual gimnasio
router.get("/aforo/actual", (req, res) => {
  client.query(
    `
    SELECT COUNT(*) as actual,(SELECT aforo FROM Gimnasio WHERE dia_semana = EXTRACT(DOW FROM CURRENT_DATE)::INTEGER LIMIT 1) as aforo FROM RegistrosGimnasio rg WHERE rg.salida IS NULL;`,
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

//POST new registro gimnasio with only Matricula
router.post("/matricula", (req, res) => {
  const body = req.body;
  client.query(
    `INSERT INTO RegistrosGimnasio (matricula, entrada, salida, fecha) VALUES ($1, to_char(current_timestamp AT TIME ZONE 'America/Monterrey', 'HH:MI:SS')::time, NULL, current_timestamp AT TIME ZONE 'America/Monterrey') RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.matricula],
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
    `UPDATE RegistrosGimnasio
    SET matricula = $1, entrada = $2, salida = $3,  fecha = $4 WHERE id = $5 RETURNING *, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha;`,
    [body.matricula, body.entrada, body.salida, body.fecha, body.id],
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

//UPDATE registro gimnasio with only Matricula
router.put("/matricula", (req, res) => {
  const body = req.body;
  client.query(
    `UPDATE RegistrosGimnasio
    SET salida = to_char(current_timestamp AT TIME ZONE 'America/Monterrey', 'HH:MI:SS')::time
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
      } else {
        return res.status(200).json(results.rows[0]);
      }
    }
  );
});



//DELETE registro gimnasio
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  client.query(`DELETE FROM RegistrosGimnasio WHERE id = $1`,
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
