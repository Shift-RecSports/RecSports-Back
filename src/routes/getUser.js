import { db } from "../database";

export const getUserRoute = {
    method: 'GET',
    path: 'api/user/{id}',
    handler: async (req, h) =>{
        const {results} = await db.query(
            'SELECT * FROM Usuarios'
        );
      
        return results;
    }
}