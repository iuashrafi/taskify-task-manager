const express = require("express");
const router = express.Router();
const {
  createTask,
  deleteTask,
  updateTask,
  reorderTasksWithinCol,
} = require("../controllers/taskController");

router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/reorder/:columnId", reorderTasksWithinCol);

module.exports = router;
