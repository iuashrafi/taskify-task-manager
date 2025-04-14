const express = require("express");
const router = express.Router();
const { renameProject } = require("../controllers/userController");

router.patch("/rename", renameProject);

module.exports = router;
