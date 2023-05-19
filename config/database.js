require("dotenv").config();
const { Client } = require('pg');

// Replace the connection link with your own PostgreSQL connection details
const connectionLink = process.env.CONNECTION_LINK;

// Create a new PostgreSQL client
const client = new Client({
  connectionString: connectionLink,
});

// Connect to the database
client.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database');
  });
  
  // Define a helper function to execute queries and return only the rows
  module.exports.queryRows = async (query, params) => {
    try {
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };

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

