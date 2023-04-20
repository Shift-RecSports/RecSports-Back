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

