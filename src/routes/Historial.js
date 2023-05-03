import { db } from "../database";
import { default as short } from 'short-uuid';

//GET todo el historial de aforos
export const getHistoriales = {
  method: 'GET',
  path: '/api/historial',
  handler: async (req, h) => {
    const { results } = await db.query(
      `SELECT *,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha
        FROM Historial;`,
    );
    return results;
  }
};

//GET 1 historial de aforo
export const getHistorial = {
  method: 'GET',
  path: '/api/historial/{id}',
  handler: async (req, h) => {
    const { id } = req.params;
    const { results } = await db.query(
      `SELECT * ,DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha
      FROM Historial WHERE id= ?;`,
      [id]
    );
    return results[0];
  }
};

//CREAR 1 historial de aforo
export const postHistorial = {
  method: 'POST',
  path: '/api/historial',
  handler: async (req, h) => {
    // Body example
    //   {
    //     "num_semana": 1,
    //     "fecha": "2023-01-01",
    //     "hora_inicio": "10:00:00",
    //     "contador": 10,
    //     "dia_semana": 1
    // }
    const body = JSON.parse(req.payload);
    const id = short.generate(); //22 character uuid
    try {
      await db.query(
        `INSERT INTO Historial(id, num_semana, fecha, hora_inicio, contador, dia_semana) VALUES(?,?,DATE(?),?,?,?)`,
        [id, body.num_semana, body.fecha, body.hora_inicio, body.contador, body.dia_semana]

      );
    }
    catch (e) {
      console.log(e)
    }
    const { results } = await db.query(
      `SELECT *, DATE_FORMAT(fecha, '%Y-%m-%d')AS fecha FROM Historial WHERE id = ?`,
      [id]
    );

    return results[0]
  }
};

//UPDATE 1 historial de aforo
export const updateHistorial = {
  method: 'PUT',
  path: '/api/historial/{id}',
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

//DELETE  1 historial de aforo
export const deleteHistorial = {
  method: 'DELETE',
  path: '/api/historial/{id}',
  handler: async (req, h) => {

    const { id } = req.params;

    await db.query(
      `DELETE FROM RegistrosGimnasio WHERE id = ?;`,
      [id],
    );

    return { message: 'Success' }
  }
};


//GET Lista de Concurrencias Aforo Gimnasio
export const getConcurrenciasAforoGimnasio = {
  method: 'GET',
  path: '/api/concurrencias-aforo-gimnasio/{num_semana}/{dia_semana}',
  handler: async (req, h) => {

    const { num_semana } = req.params;
    const { dia_semana } = req.params;

    const { results } = await db.query(
      `SELECT 
    hora_inicio, 
    ADDTIME(hora_inicio, '01:00:00') as hora_fin,
    AVG(contador) as historico,
    CASE 
        WHEN HOUR(NOW()) = HOUR(hora_inicio) AND MINUTE(NOW()) >= MINUTE(hora_inicio) THEN 
            (SELECT COUNT(*) FROM RegistrosGimnasio rg WHERE rg.salida IS NULL) 
        ELSE 
            NULL 
    END as actual
FROM 
    Historial
WHERE 
    num_semana = ? 
    AND dia_semana = ?
GROUP BY 
    hora_inicio
ORDER BY 
    hora_inicio;
`,
      [num_semana, dia_semana]
    );
    return results;
  }
};


