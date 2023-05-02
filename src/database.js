const mysql = require('mysql');
require('dotenv').config();


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});


export const db = {
    connect: () => connection.connect(),
    query: (queryString, escapedValues) =>
        new Promise((resolve, reject) => {
        connection.query(queryString,escapedValues,(error, results, fields) => {
            if(error) reject(error);
            resolve({results,fields});
        })

        }),
        end: () => connection.end(),
}



