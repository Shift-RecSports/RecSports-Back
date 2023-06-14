require("dotenv").config();
const { Client } = require('pg');

// Reemplaza el enlace de conexión con tus propios detalles de conexión de PostgreSQL
const connectionLink = process.env.CONNECTION_LINK;

// Crea un nuevo cliente de PostgreSQL
const client = new Client({
  connectionString: connectionLink,
  timezone: "America/Monterrey"
});

// Conectarse a la base de datos
client.connect((err) => {
    if (err) {
      console.error('Error al conectarse a la base de datos:', err);
      return;
    }
    console.log('Conectado a la base de datos');
    client.query('SET TIME ZONE \'America/Monterrey\'');
    console.log('Zona horaria establecida en America/Monterrey');
});

// Desconectar de la base de datos
module.exports.disconnect = () => {
    client.end((error) => {
      if (error) {
        console.error('Error al desconectarse de la base de datos:', error);
        return;
      }
      console.log('Desconectado de la base de datos');
    });
};

module.exports = client;
