const cron = require("node-cron");
const client = require("../config/database");

const runJobEveryMinute = () => {
  const job = cron.schedule("* * * * *", () => {
    console.log("Running job every minute");

    // Execute the query to get all deportes
    client.query("SELECT * FROM DEPORTES", (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results.rows);
        // Process the results or perform any other necessary actions
      }
    });
  });

  // Start the job
  job.start();
};

module.exports = { runJobEveryMinute };