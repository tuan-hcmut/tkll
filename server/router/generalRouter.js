const express = require("express");
const generalController = require("../controller/generalController");

const router = express.Router();

router.get("/api/energy/buy", generalController.buyEnergy);

module.exports = router;
