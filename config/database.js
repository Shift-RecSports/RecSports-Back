require("dotenv").config();
const { Client } = require('pg');

// Replace the connection link with your own PostgreSQL connection details
const connectionLink = process.env.CONNECTION_LINK;

// Create a new PostgreSQL client
const client = new Client({
  connectionString: connectionLink,
  timezone: "America/Monterrey"

});

// Connect to the database
client.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database');
    client.query('SET TIME ZONE \'America/Monterrey\'');
    console.log('Time zone set to America/Monterrey');
  });
  

// Disconnect from the database
module.exports.disconnect = () => {
    client.end((error) => {
      if (error) {
        console.error('Error disconnecting from the database:', error);
        return;
      }
      console.log('Disconnected from the database');
    });
  };
  
  module.exports = client;

