const express = require("express");
const router = express.Router();
const { createColumn } = require("../controllers/columnController")


router.post('/', createColumn);

module.exports = router;