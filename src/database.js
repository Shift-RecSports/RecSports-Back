// import mysql from 'mysql';


const mysql = require('mysql');



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'hapi-server',
    password: 'Computadora5',
    database: 'RecSports',

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



