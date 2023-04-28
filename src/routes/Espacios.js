import { db } from "../database";
import shortid from 'shortid';

//GET todos los espacios
export const getEspacios = {
    method: 'GET',
    path: '/api/espacios',
    handler: async (req, h) => {
      const { results } = await db.query(
        `SELECT * FROM ESPACIOS`,
      );
      return results;
    }
  };

//GET 1 espacio
export const getEspacio = {
  method: 'GET',
  path: '/api/espacios/{id}',
  handler: async (req, h) => {
    const {id} = req.params;
    const { results } = await db.query(
      `SELECT * FROM Espacios WHERE id = ?;`,
      [id]
    );
    return results[0];
  }
};

//CREAR 1 espacio
export const postEspacio = {
  method: 'POST',
  path: '/api/espacios',
  handler: async (req, h) => {

    // Body example
  //   {
  //     "nombre": "Cancha de tenis",
  //     "hora_inicio": "08:00:00",
  //     "hora_fin": "22:00:00",
  //     "aforo": 20,
  //     "zona": "Zona Norte",
  //     "deporte": "DPT001"
  // }
    const body = JSON.parse(req.payload);
    const id = shortid.generate(); //9 characters

    await db.query(
      `INSERT INTO Espacios (id, nombre, hora_inicio, hora_fin, aforo, zona, deporte) VALUES (?,?,?,?,?,?,?);`,
      [id, body.nombre, body.hora_inicio, body.hora_fin, body.aforo, body.zona, body.deporte]
    );

    const {results} = await db.query(
      `SELECT * FROM Espacios WHERE id = ?`,
      [id]
    );
    return results[0];
  }
};

//UPDATE 1 deporte
export const updateEspacio = {
  method: 'PUT',
  path: '/api/espacios/{id}',
  handler: async (req, h) => {

    const {id} = req.params;
    const body = JSON.parse(req.payload);
    // Body example
  //   {
  //     "nombre": "Cancha de tenis",
  //     "hora_inicio": "08:00:00",
  //     "hora_fin": "22:00:00",
  //     "aforo": 20,
  //     "zona": "Zona Norte",
  //     "deporte": "DPT001"
  // }
      const update = await db.query(
        `UPDATE Espacios SET nombre = ?, hora_inicio = ?, hora_fin = ?, aforo = ?, zona = ?, deporte = ? WHERE id = ?;`,
        [body.nombre, body.hora_inicio, body.hora_fin, body.aforo, body.zona, body.deporte, id]
      );
      
      const { results } = await db.query(
        `SELECT * FROM Espacios WHERE id = ?`,
        [id],
      );
      
      return results[0];
    
  }
};

//DELETE  1 espacio
export const deleteEspacio = {
  method: 'DELETE',
  path: '/api/espacios/{id}',
  handler: async (req, h) => {

    const {id} = req.params;
  
    await db.query(
      `DELETE FROM Espacios WHERE id = ?;`,
      [id],
    );

      return {message: 'Success'}
      
  }
};