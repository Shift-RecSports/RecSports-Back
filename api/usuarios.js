const express = require("express");
const router = express.Router();
const client = require("../config/database");

//GET all usuarios
router.get("/", (req, res) => {
  client.query(`SELECT * FROM Usuarios;`, (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    
    return res.json(results.rows);
  });
});

//GET usario by Matricula
router.get("/:matricula", (req, res) => {
  const matricula= req.params.matricula;
  client.query(`SELECT * FROM Usuarios WHERE matricula = $1;`,[matricula], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    return res.status(200).json(results.rows[0]);
  });
});


//POST usario Login
router.post("/login", (req, res) => {
  const body = req.body;
  client.query(`SELECT u.matricula, u.nombre, tu.tipo
  FROM Usuarios u
  JOIN Accesos a ON u.matricula = a.matricula
  JOIN TipoUsuario tu ON u.tipo = tu.id
  WHERE u.matricula = $1
    AND a.contrasena = $2;`,[body.matricula,body.contrasena], (error, results, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error respuesta de servidor",
      });
    }
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario y contraseña incorrectos",
      });
    }
    return res.status(200).json(results.rows[0]);
  });
});

//POST new usuario
router.post("/", (req, res) => {
  const body = req.body;
  client.query(
    `INSERT INTO Usuarios (matricula, nombre, tipo)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [body.matricula, body.nombre, body.tipo],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: error.detail,
        });
      }
      // Retrieve the inserted usuario
      const usuario = results.rows[0];
      // Insert the access credentials
      client.query(
        `INSERT INTO Accesos (matricula, contrasena)
        VALUES ($1, $2)`,
        [body.matricula, body.contrasena],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return res.status(500).json({
              message: "Error respuesta de servidor",
            });
          }

          return res.status(201).json(usuario);
        }
      );
    }
  );
});

//UPDATE historial
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



module.exports = router;
