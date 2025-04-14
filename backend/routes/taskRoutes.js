const express = require("express");
const router = express.Router();
const {
  createTask,
  deleteTask,
  renameProject,
  updateTask,
  reorderTasksWithinCol,
} = require("../controllers/taskController");

router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/reorder/:columnId", reorderTasksWithinCol);
router.patch("/projectName", renameProject);

module.exports = router;
