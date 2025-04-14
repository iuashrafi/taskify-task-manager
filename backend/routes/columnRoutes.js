const express = require("express");
const router = express.Router();
const {
  createColumn,
  getColumnsWithTasks,
  reorderColumns,deleteColumn, updateColumn
} = require("../controllers/columnController");

router.post("/", createColumn);
router.get("/", getColumnsWithTasks);
router.patch("/reorder", reorderColumns);
router.delete("/:id", deleteColumn);
router.patch("/:id", updateColumn);  

module.exports = router;
