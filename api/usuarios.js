const express = require("express");
const router = express.Router();
const client = require("../config/database");
const multer = require("multer");
const upload = multer();


//GET all usuarios
router.get("/", (req, res) => {
  client.query(`SELECT u.matricula, u.nombre, tu.tipo FROM Usuarios u JOIN TipoUsuario tu ON u.tipo = tu.id;`, (error, results, fields) => {
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
  client.query(`SELECT u.matricula, u.nombre, tu.tipo FROM Usuarios u JOIN TipoUsuario tu ON u.tipo = tu.id WHERE matricula = $1;`,[matricula], (error, results, fields) => {
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
//Verifica las credenciales proporcionadas por el usuario en la base de datos y responde con el resultado: si las credenciales son correctas, devuelve los detalles del usuario 
router.post("/login",upload.single(), (req, res) => {
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
router.post("/",upload.single(), (req, res) => {
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



module.exports = router;
