const {getDeportes, createDeporte} = require("./deportes.controller.js");
const router = require("express").Router();

router.get("/", getDeportes);
router.post("/", createDeporte);

module.exports = router;