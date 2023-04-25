import { db } from "../database";

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
  path: '/deportes/{id_deporte}',
  handler: async (req, h) => {
    const {id_deporte} = req.params;
    console.log(id_deporte);
    const { results } = await db.query(
      `SELECT * FROM Deportes WHERE id_deporte = ?;`,
      [id_deporte]
    );
    return results[0];
  }
};

//CREAR 1 deporte
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
      [ body.nombre, body.descripcion, body.materiales, body.imagen, body.duracion]
    );
    return body;
  }
};

//UPDATE 1 deporte
export const updateDeporte = {
  method: 'PUT',
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

      const update = await db.query(
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

//DELETE  1 deporte
export const deleteDeporte = {
  method: 'DELETE',
  path: '/deportes/{id_deporte}',
  handler: async (req, h) => {

    const {id_deporte} = req.params;
  
      await db.query(
        `call delete_Deporte(?)`,
        [ id_deporte],
      );

      return null
      
  }
};