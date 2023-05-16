const { getDeportes, createDeporte } = require("./deportes.service");
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./images/deportes",
  filename: function (req, file, callback) {
    // Generate a unique filename
    const uniqueName = `deporte_${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

// Create upload instance
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  getDeportes((err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    return res.json(results);
  });
});

router.post("/", upload.single("imagen"), (req, res) => {
  console.log(req.body);
  const body = req.body;
  const filename = req.file.filename; // Retrieve the filename from the request
  createDeporte({ ...body, imagen: filename }, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }

    return res.status(200).json(results);
  });
});

module.exports = router;
