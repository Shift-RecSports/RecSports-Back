import { db } from "../database";
import shortid from 'shortid';

//GET todos las noticias
export const getNoticias = {
    method: 'GET',
    path: '/api/noticias',
    handler: async (req, h) => {
      const { results } = await db.query(
        `SELECT *,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha FROM Noticias`,
      );
      return results;
    }
  };

//GET 1 noticia
export const getNoticia = {
  method: 'GET',
  path: '/api/noticias/{id}',
  handler: async (req, h) => {
    const {id} = req.params;
    const { results } = await db.query(
      `SELECT *,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha FROM Noticias WHERE id = ?;`,
      [id]
    );
    return results[0];
  }
};

//CREAR 1 noticia
export const postNoticia = {
  method: 'POST',
  path: '/api/noticias',
  handler: async (req, h) => {

    // Body example
    // {
    //   "fecha": "2023-05-02",
    //   "horario": "09:00:00",
    //   "url": "https://noticia1.com",
    //   "imagen": "imagen1.jpg"
    // }
    const body = JSON.parse(req.payload);
    const id = shortid.generate(); //9 characters
    try{
      await db.query(
        `INSERT INTO Noticias (id, fecha, horario, url, imagen) VALUES (?,?,?,?,?);`,
        [id, body.fecha, body.horario, body.url, body.imagen]
      );
    }
    catch(e){
      console.log(e)
    }
    

    const {results} = await db.query(
      `SELECT *,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha FROM Noticias WHERE id = ?`,
      [id]
    );
    return results[0];
  }
};

//UPDATE 1 deporte
export const updateNoticia = {
  method: 'PUT',
  path: '/api/noticias/{id}',
  handler: async (req, h) => {

    const {id} = req.params;
    const body = JSON.parse(req.payload);
    // Body example
    // {
    //   "fecha": "2023-05-02",
    //   "horario": "09:00:00",
    //   "url": "https://noticia1.com",
    //   "imagen": "imagen1.jpg"
    // }

      const update = await db.query(
        `UPDATE Noticias SET fecha = ?, horario = ?, url = ?, imagen = ? WHERE id = ?;`,
        [ body.fecha, body.horario, body.url, body.imagen,id],
      );
      
      const { results } = await db.query(
        `SELECT *,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha FROM Noticias WHERE id = ?`,
        [id],
      );
      
      return results[0];
    
  }
};

//DELETE  1 deporte
export const deleteNoticia = {
  method: 'DELETE',
  path: '/api/noticias/{id}',
  handler: async (req, h) => {

    const {id} = req.params;
  
    await db.query(
      `DELETE FROM Noticias WHERE id = ?;`,
      [id],
    );


      return {message: 'Success'}
      
  }
};