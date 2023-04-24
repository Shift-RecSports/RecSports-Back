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
  
      var {id_deporte, nombre,descripcion, materiales, imagen, duracion} = req.payload;
   
      const { results } = await db.query(
        `INSERT INTO Deportes (id_deporte, nombre, descripcion, materiales, imagen, duracion) VALUES (?,?,?,?,?,?);`,
        [id_deporte, nombre, descripcion, materiales, imagen, duracion]
      );
      return results[0];
    }
  };