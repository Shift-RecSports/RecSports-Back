import { db } from "../database";
import shortid from 'shortid';

//GET todos los deportes
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

//GET 1 deporte
export const getDeporte = {
  method: 'GET',
  path: '/deportes/{id}',
  handler: async (req, h) => {
    const {id} = req.params;
    const { results } = await db.query(
      `SELECT * FROM Deportes WHERE id = ?;`,
      [id]
    );
    return results[0];
  }
};

//CREAR 1 deporte
export const postDeporte = {
  method: 'POST',
  path: '/deportes',
  handler: async (req, h) => {

    // Body example
    // {
    //   "nombre": "Tennis",
    //   "descripcion": "Deporte que se juega con una raqueta y una pelota",
    //   "materiales": "Raqueta, pelota, red, calzado deportivo",
    //   "imagen": "https://ejemplo.com/tenis.png",
    //   "duracion": 120
    // }
    const body = JSON.parse(req.payload);
    const id = shortid.generate(); //9 characters
    await db.query(
      `INSERT INTO Deportes (id, nombre, descripcion, materiales, imagen, duracion) VALUES (?,?,?,?,?,?);`,
      [id, body.nombre, body.descripcion, body.materiales, body.imagen, body.duracion]
    );

    const {results} = await db.query(
      `SELECT * FROM Deportes WHERE id = ?`,
      [id]
    );
    return results[0];
  }
};

//UPDATE 1 deporte
export const updateDeporte = {
  method: 'PUT',
  path: '/deportes/{id}',
  handler: async (req, h) => {

    const {id} = req.params;
    const body = JSON.parse(req.payload);
    // Body example
    // {
    //   "nombre": "Tennis",
    //   "descripcion": "Deporte que se juega con una raqueta y una pelota",
    //   "materiales": "Raqueta, pelota, red, calzado deportivo",
    //   "imagen": "https://ejemplo.com/tenis.png",
    //   "duracion": 120
    // }

      const update = await db.query(
        `UPDATE Deportes SET nombre = ?, descripcion = ?, materiales = ?, imagen = ?, duracion = ? WHERE id = ?;`,
        [ body.nombre, body.descripcion, body.materiales, body.imagen, body.duracion,id],
      );
      
      const { results } = await db.query(
        `SELECT * FROM Deportes WHERE id = ?`,
        [id],
      );
      
      return results[0];
    
  }
};

//DELETE  1 deporte
export const deleteDeporte = {
  method: 'DELETE',
  path: '/deportes/{id}',
  handler: async (req, h) => {

    const {id} = req.params;
  
      await db.query(
        `call deporteDelete(?)`,
        [id],
      );

      return {message: 'Success'}
      
  }
};