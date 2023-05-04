import { db } from "../database";
import { default as short } from 'short-uuid';


//GET todass las reservaciones
export const getReservaciones = {
  method: 'GET',
  path: '/api/reservaciones',
  handler: async (req, h) => {
    const { results } = await db.query(
      `SELECT Reservaciones.*, Espacios.zona, Espacios.nombre AS espacio_nombre, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha
      FROM Reservaciones
      JOIN Espacios ON Reservaciones.espacio = Espacios.id;`,
    );
    return results;
  }
};


//GET todass las reservaciones por matricula
export const getReservacionesMatricula = {
  method: 'GET',
  path: '/api/reservaciones/matricula={matricula}',
  handler: async (req, h) => {
    const { matricula } = req.params;
    const { results } = await db.query(
      `SELECT r.*, e.zona, e.nombre as espacio_nombre, DATE_FORMAT(r.fecha, '%Y-%m-%d') AS fecha
      FROM Reservaciones r
      JOIN Espacios e ON r.espacio = e.id
      WHERE r.matricula_alumno = ?;`,
      [matricula]
    );
    return results;
  }
};

//GET todass las reservaciones por deporte
export const getReservacionesDeporteFecha = {
  method: 'GET',
  path: '/api/reservaciones/deporte={deporte}&fecha={fecha}',
  handler: async (req, h) => {
    const { deporte } = req.params;
    const { fecha } = req.params;

    try{

    }
    catch(e){
      console.log()
    }
    const { results } = await db.query(
      `SELECT Reservaciones.*, Espacios.zona, Espacios.nombre AS espacio_nombre, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha
      FROM Reservaciones
      JOIN Espacios ON Reservaciones.espacio = Espacios.id
      WHERE Reservaciones.fecha = ? AND Espacios.deporte = ?;`,
      [fecha, deporte]
    );
    return results;
  }
};

//GET 1 reservacion
export const getReservacion = {
  method: 'GET',
  path: '/api/reservaciones/{id}',
  handler: async (req, h) => {
    const { id } = req.params;
    const { results } = await db.query(
      `SELECT Reservaciones.*, Espacios.zona, Espacios.nombre AS espacio_nombre, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha
      FROM Reservaciones
      JOIN Espacios ON Reservaciones.espacio = Espacios.id
      WHERE Reservaciones.id = ?;`,
      [id]
    );
    return results[0];
  }
};

//CREAR 1 registro degimnasio
export const postReservacion = {
  method: 'POST',
  path: '/api/reservaciones',
  handler: async (req, h) => {
    // Body example
  //   {
  //     "hora_seleccionada": "08:00:00",
  //     "matricula_alumno": "A01570656",
  //     "fecha": "2023-05-04",
  //     "espacio": "E1",
  //     "estatus": 1
  // }
    const body = JSON.parse(req.payload);
    const id = short.generate(); //22 character uuid

  
      await db.query(
        `INSERT INTO Reservaciones(id, hora_seleccionada, matricula_alumno, fecha, espacio, estatus) VALUES(?,?, ?, ?, ?, ?)`,
        [id, body.hora_seleccionada, body.matricula_alumno, body.fecha, body.espacio, body.estatus]
      );

    const { results } = await db.query(
      `SELECT Reservaciones.*, Espacios.zona, Espacios.nombre AS espacio_nombre, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha
      FROM Reservaciones
      JOIN Espacios ON Reservaciones.espacio = Espacios.id
      WHERE Reservaciones.id = ?;`,
      [id]
    );

    return results[0]
    
  }
};

//UPDATE 1 deporte
export const updateReservacion = {
  method: 'PUT',
  path: '/api/reservaciones/{id}',
  handler: async (req, h) => {
    const { id } = req.params;
    const body = JSON.parse(req.payload);
      // Body example
  //   {
  //     "hora_seleccionada": "08:00:00",
  //     "matricula_alumno": "A01570656",
  //     "fecha": "2023-05-04",
  //     "espacio": "E1",
  //     "estatus": 1
  // }
      
    await db.query(
      `UPDATE Reservaciones SET hora_seleccionada = ?, matricula_alumno = ?, fecha = ?, espacio = ?, estatus = ? WHERE id = ? ;`,
      [body.hora_seleccionada, body.matricula_alumno, body.fecha, body.espacio, body.estatus, id],
    );
    
    const { results } = await db.query(
      `SELECT Reservaciones.*, Espacios.zona, Espacios.nombre AS espacio_nombre, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha
      FROM Reservaciones
      JOIN Espacios ON Reservaciones.espacio = Espacios.id
      WHERE Reservaciones.id = ?;`,
      [id],
    );
    return results[0];
  }
};

//DELETE  1 reservacion
export const deleteReservacion = {
  method: 'DELETE',
  path: '/api/reservaciones/{id}',
  handler: async (req, h) => {

    const { id } = req.params;

    await db.query(
      `DELETE FROM Reservaciones WHERE id = ?;`,
      [id],
    );

    return { message: 'Success' }
  }
};


