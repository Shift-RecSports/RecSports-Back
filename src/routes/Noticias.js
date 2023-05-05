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
  //   {
  //     "lugar": "Tecnológico de Monterrey",
  //     "fecha": "2023-05-03",
  //     "hora": "14:00:00",
  //     "titulo": "Inauguración de nuevas áreas deportivas",
  //     "imagen": "https://cdn.milenio.com/uploads/media/2019/04/30/borregos-estrena-estadio-espectaculo-hector.jpg",
  //     "url": "https://example.com/noticias/1"
  // }
    const body = JSON.parse(req.payload);
    const id = shortid.generate(); //9 characters
    
      await db.query(
        `INSERT INTO Noticias(id, lugar, fecha, hora, titulo, imagen, url) VALUES (?,?,?,?,?,?,?);`,
        [id, body.lugar, body.fecha, body.hora, body.titulo, body.imagen, body.url]
      );
    

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
  //   {
  //     "lugar": "Tecnológico de Monterrey",
  //     "fecha": "2023-05-03",
  //     "hora": "14:00:00",
  //     "titulo": "Inauguración de nuevas áreas deportivas",
  //     "imagen": "https://cdn.milenio.com/uploads/media/2019/04/30/borregos-estrena-estadio-espectaculo-hector.jpg",
  //     "url": "https://example.com/noticias/1"
  // }
  
      const update = await db.query(
        `UPDATE Noticias SET lugar = ?, fecha = ?, hora = ?, titulo = ?, imagen = ?, url = ' WHERE id = ?;`,
        [ body.lugar, body.fecha, body.hora, body.titulo,body.imagen, body.url, id],
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