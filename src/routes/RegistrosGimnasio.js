import { db } from "../database";

//GET todos los registros de Gimnasio
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

//GET 1 registro de gimnasio
export const getRegistroGimnasio = {
  method: 'GET',
  path: '/registros-gimnasio/{id_registro}',
  handler: async (req, h) => {
    const {id_registro} = req.params;
    const { results } = await db.query(
      `SELECT * FROM RegistrosGimnasio WHERE id_registro = ?;`,
      [id_registro]
    );
    return results[0];
  }
};

//CREAR 1 registro degimnasio
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

//UPDATE 1 deporte
export const updateRegistroGimnasio = {
  method: 'PUT',
  path: '/registros-gimnasio/{id_registro}',
  handler: async (req, h) => {

    const {id_registro} = req.params;
    const body = JSON.parse(req.payload);
    // Body example
      // {
      //   "matricula": "A01111111",
      //   "entrada": "08:00:00",
      //   "salida": "09:00:00",
      //   "fecha": "2022-01-03T06:00:00.000Z"
      // }

      RegistrosGimnasio(matricula, entrada, salida, fecha)
    await db.query(
      `UPDATE RegistrosGimnasio SET matricula = ?, entrada = ?, salida = ?, fecha = ?,WHERE id_deporte = ?;`,
      [ body.matricula, body.entrada, body.salida, body.fecha, id_registro],
    );
    const { results } = await db.query(
      `SELECT * FROM RegistrosGimnasio WHERE id_registro = ?`,
      [id_registro],
    );
    return results[0];
  }
};

//DELETE  1 deporte
export const deleteRegistroGimnasio = {
method: 'DELETE',
path: '/registros-gimnasio/{id_registro}',
handler: async (req, h) => {

  const {id_registro} = req.params;

    const {results} = await db.query(
      `DELETE FROM RegistrosGimnasio WHERE id_registro = ?;`,
      [id_registro],
    );
    
    return null
}
};