import { db } from "../database";
import { default as short } from 'short-uuid';

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
  path: '/registros-gimnasio/{id}',
  handler: async (req, h) => {
    const {id} = req.params;
    const { results } = await db.query(
      `SELECT * ,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha
      FROM RegistrosGimnasio WHERE id= ?;`,
      [id]
    );
    return results[0];
  }
};

//CREAR 1 registro degimnasio
export const postRegistroGimnasio = {
  method: 'POST',
    path: '/registros-gimnasio',
    handler: async (req, h) => {
      // Body example
      // {
      //   "id": "20",
      //   "matricula": "A01570656",
      //   "entrada": "08:00:00",
      //   "salida": "10:00:00",
      //   "fecha": "2023-04-27"
      // }
      const body = JSON.parse(req.payload);
      const id = short.generate(); //22 character uuid

      await db.query(
        `INSERT INTO RegistrosGimnasio(id, matricula, entrada, salida, fecha) VALUES(?,?, ?, ?, DATE(?))`,
        [ id, body.matricula, body.entrada, body.salida, body.fecha]
      );
      const {results} = await db.query(
        `SELECT *, DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha FROM Registrosgimnasio WHERE id = ?`,
        [id]
      );

      return results[0]
    }
};

//UPDATE 1 deporte
export const updateRegistroGimnasio = {
  method: 'PUT',
  path: '/registros-gimnasio/{id}',
  handler: async (req, h) => {
    const {id} = req.params;
    const body = JSON.parse(req.payload);
    // Body example
  //   {
  //     "matricula": "A01570656",
  //     "entrada": "19:00:00",
  //     "salida": null,
  //     "fecha": "2023-04-28"
  // }
     try{
    await db.query(
      `UPDATE RegistrosGimnasio SET matricula = ?, entrada = ?, salida = ?, fecha = ?WHERE id = ? ;`,
      [ body.matricula, body.entrada, body.salida, body.fecha, id],
    );}
    catch (e){
      console.log(e)
    }
    const { results } = await db.query(
      `SELECT *,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha FROM RegistrosGimnasio WHERE id = ? ;`,
      [id],
    );
    return results[0];
  }
};

//DELETE  1 deporte
export const deleteRegistroGimnasio = {
method: 'DELETE',
path: '/registros-gimnasio/{id}',
handler: async (req, h) => {

  const {id} = req.params;

  await db.query(
    `DELETE FROM RegistrosGimnasio WHERE id = ?;`,
    [id],
  );
    
    return {message: 'Success'}
}
};


