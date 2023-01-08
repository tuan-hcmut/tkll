const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.get("/api/infor", userController.getInfor);

module.exports = router;
