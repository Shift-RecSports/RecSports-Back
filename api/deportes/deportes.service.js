const pool = require("../../config/database");
const shortid = require("shortid");

module.exports = {
  getDeportes: (callBack) => {
    pool.query(`SELECT * FROM DEPORTES`, (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },
  createDeporte: (data, callBack) => {
    const id = shortid.generate(); // 9 digits id
    pool.query(
      `INSERT INTO Deportes (id, nombre, descripcion, materiales, imagen, duracion) VALUES (?,?,?,?,?,?);`,
      [
        id,
        data.nombre,
        data.descripcion,
        data.materiales,
        data.imagen,
        data.duracion,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          pool.query(
            `SELECT * FROM Deportes WHERE id = ?;`,
            [id],
            (error, results, fields) => {
              if (error) {
                callBack(error);
              } else {
                return callBack(null, results[0]);
              }
            }
          );
        }
      }
    );
  },
};
