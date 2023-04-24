import { db } from "../database";

export const getRegistrosGimnasio = {
    method: 'GET',
    path: '/registros-gimnasio',
    handler: async (req, h) => {
      const { results } = await db.query(
        `SELECT *,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha
        FROM RegistrosGimnasio;`,
      );
      return results;
    }
  };

  export const postRegistroGimnasio = {
    method: 'POST',
    path: '/agregar-registro-gimnasio',
    handler: async (req, h) => {

      // Body example
      // {
      //   "matricula": "A01111111",
      //   "entrada": "08:00:00",
      //   "salida": "09:00:00",
      //   "fecha": "2022-01-03T06:00:00.000Z"
      // }
  
      const body = JSON.parse(req.payload);
      await db.query(
        `INSERT INTO RegistrosGimnasio(matricula, entrada, salida, fecha) VALUES(?, ?, ?, DATE(?));`,
        [ body.matricula, body.entrada, body.salida, body.fecha]
      );
      return body;
    }
  };


  export const updateRegistroGimnasio = {
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


  export const deleteDeporte = {
    method: 'DELETE',
    path: '/deportes/{id_deporte}',
    handler: async (req, h) => {

      const {id_deporte} = req.params;
    
      try {
        await db.query(
          `call delete_Deporte(?)`,
          [ id_deporte],
        );
        return {message : `Deporte ${id_deporte} ha sido eliminado`};
      } catch (error) {
        console.error(error);
        return h.response({ error: `Error eliminando deporte ${id_deporte}` }).code(500);
      }
    }
  };