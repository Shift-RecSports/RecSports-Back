import { db } from "../database";

export const getUserRoute = {
    method: 'GET',
    path: '/api/user/{id}',
    handler: async (req, h) =>{
        const {results} = await db.query(
            `SELECT *
            FROM Accesos a
            WHERE a.id_matricula = ? AND a.contrasena = ?;`,
            [id]
        );
      
        return results;
    }
}

export const getUsuario = {
    method: 'GET',
    path: '/api/usuario/{id}',
    handler: async (req, h) => {
        const id = String(req.params.id);
      const { results } = await db.query(
        `SELECT * FROM RecSports.Usuarios u
        WHERE id_matricula = ?`,
       [id]
      );
      return results;
    }
  };