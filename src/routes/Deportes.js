import { db } from "../database";

export const getDeportes = {
    method: 'GET',
    path: '/deportes',
    handler: async (req, h) => {
      const { results } = await db.query(
        `SELECT * FROM Deportes`,
      );
      return results;
    }
  };

  export const postDeporte = {
    method: 'POST',
    path: '/agregar-deporte',
    handler: async (req, h) => {

      // Body example
      // {
      //   "nombre": "Ping Pong",
      //   "descripcion": "Deporte de mesa",
      //   "materiales": "Raquetas de ping pong, pelotas",
      //   "imagen": "pingpong.jpg",
      //   "duracion": 60
      // }
  
      const body = JSON.parse(req.payload);
      await db.query(
        `INSERT INTO Deportes (nombre, descripcion, materiales, imagen, duracion) VALUES (?,?,?,?,?);`,
        [ body.nombre, body.descripcion, body.materiales, body.imagen, newDeporte.duracion]
      );
      return newDeporte;
    }
  };


  export const updateDeporte = {
    method: 'POST',
    path: '/deportes/{id_deporte}',
    handler: async (req, h) => {

      const {id_deporte} = req.params;
      const body = JSON.parse(req.payload);
      // Body example
      // {
      //   "nombre": "Ping Pong",
      //   "descripcion": "Deporte de mesa",
      //   "materiales": "Raquetas de ping pong, pelotas",
      //   "imagen": "pingpong.jpg",
      //   "duracion": 60
      // }
      await db.query(
        `UPDATE Deportes SET nombre = ?, descripcion = ?, materiales = ?, imagen = ?, duracion = ? WHERE id_deporte = ?;`,
        [ body.nombre, body.descripcion, body.materiales, body.imagen, body.duracion,id_deporte],
      );
      const { results } = await db.query(
        `SELECT * FROM Deportes WHERE id_deporte = ?`,
        [id_deporte],
      );
      return results[0];
    }
  };