const { getDeportes, createDeporte } = require("./deportes.service");

module.exports = {
  getDeportes: (req, res) => {
    getDeportes((err, results) => {
      if (err) {
        console.log(err);
        return;
       
      }

      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  createDeporte: (req, res) => {
    console.log(req)
    const body = req.body;
    console.log(body)
    createDeporte(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }

      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
};


