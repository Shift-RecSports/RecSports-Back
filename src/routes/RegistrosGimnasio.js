import { db } from "../database";
import { default as short } from 'short-uuid';

//GET todos los registros de Gimnasio
export const getRegistrosGimnasio = {
  method: 'GET',
  path: '/api/registros-gimnasio',
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
    const { id } = req.params;
    const { results } = await db.query(
      `SELECT * ,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha
      FROM RegistrosGimnasio WHERE id= ?;`,
      [id]
    );
    return results[0];
  }
};

//GET Registros Gimnasio por Fecha 
export const getRegistrosGimnasioFecha = {
  method: 'GET',
  path: '/api/registros-gimnasio/fecha/{fecha}/{offset}',
  handler: async (req, h) => {
    const { fecha } = req.params;
    const offset = parseInt(req.params.offset);
    
    const { results } = await db.query(
    `SELECT rg.id,rg.matricula, u.nombre, rg.entrada, rg.salida,DATE_FORMAT(rg.fecha, '%Y-%m-%d') as fecha
    FROM RegistrosGimnasio rg
    INNER JOIN Usuarios u ON rg.matricula = u.matricula
    WHERE rg.fecha = ?
    ORDER BY rg.entrada DESC
    LIMIT 50
    OFFSET ?;`,
    [fecha,offset]
  
    );
   
    return results;
  }
};

//CREAR 1 registro de gimnasio
export const postRegistroGimnasio = {
  method: 'POST',
  path: '/api/registros-gimnasio',
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
      [id, body.matricula, body.entrada, body.salida, body.fecha]
    );
    const { results } = await db.query(
      `SELECT *, DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha FROM Registrosgimnasio WHERE id = ?`,
      [id]
    );

    return results[0]
  }
};

//CREAR 1 registro de gimnasio con solo matricula 
export const postRegistroGimnasioMatricula = {
  method: 'POST',
  path: '/api/registros-gimnasio/matricula',
  handler: async (req, h) => {
    // Body example
    // {
    //   "matricula": "A01570656",
    // }
    try{
    const body = JSON.parse(req.payload);
    console.log(body.matricula)
    const id = short.generate(); //22 character uuid
    //console.log(new Date().toISOString().split('T')[0]);
    const fecha = new Date().toISOString().split('T')[0];
    console.log(fecha)

    }
    catch(e){
      console.log(e)

    }
    
   
    await db.query(
      `INSERT INTO RegistrosGimnasio(id, matricula, entrada, salida, fecha) VALUES(?,?, ?, NULL, DATE(?))`,
      [id, body.matricula, body.entrada,fecha]
    );
    const { results } = await db.query(
      `SELECT *, DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha FROM Registrosgimnasio WHERE id = ?`,
      [id]
    );

    // return results[0]
    return null
  }
};

//UPDATE 1 deporte
export const updateRegistroGimnasio = {
  method: 'PUT',
  path: '/api/registros-gimnasio/{id}',
  handler: async (req, h) => {
    const { id } = req.params;
    const body = JSON.parse(req.payload);
    // Body example
    //   {
    //     "matricula": "A01570656",
    //     "entrada": "19:00:00",
    //     "salida": null,
    //     "fecha": "2023-04-28"
    // }
    try {
      await db.query(
        `UPDATE RegistrosGimnasio SET matricula = ?, entrada = ?, salida = ?, fecha = ?WHERE id = ? ;`,
        [body.matricula, body.entrada, body.salida, body.fecha, id],
      );
    }
    catch (e) {
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
  path: '/api/registros-gimnasio/{id}',
  handler: async (req, h) => {

    const { id } = req.params;

    await db.query(
      `DELETE FROM RegistrosGimnasio WHERE id = ?;`,
      [id],
    );

    return { message: 'Success' }
  }
};


//GET Aforo Actual
export const getAforoActual = {
  method: 'GET',
  path: '/api/aforo-actual',
  handler: async (req, h) => {
    const { results } = await db.query(
    `SELECT 
    COUNT(*) as actual,
    (SELECT aforo FROM Gimnasio WHERE dia_semana = 1) as aforo
    FROM 
    RegistrosGimnasio rg
    WHERE 
    rg.salida IS NULL;`
  
    );
    return results[0];
  }
};
