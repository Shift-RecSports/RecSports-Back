const pool = require("../../config/database")


module.exports = {
    getDeportes: callBack => {
        pool.query(
            `SELECT * FROM DEPORTES`,
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    createDeporte: (data, callBack) => {
        pool.query(
            `INSERT INTO Deportes (id, nombre, descripcion, materiales, imagen, duracion) VALUES (?,?,?,?,?,?);`,
            ["efsefae", data.nombre, data.descripcion, data.materiales, data.imagen, data.duracion],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }
                return callBack(null, results[0])

            }
        )

    }

}