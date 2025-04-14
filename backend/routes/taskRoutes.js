const express = require("express");
const router = express.Router();
const { createTask, deleteTask } = require("../controllers/taskController");
const TaskModel = require("../models/TaskModel");
const UserModel = require("../models/UserModel");


router.patch("/projectName", async (req, res)=>{
  try {
    const { projectName } = req.body;
    const userId = req.user.userId;  

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { projectName },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success : true,
      message: 'Project name updated', 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project name', error });
  }

})


router.post("/", createTask);

// Update a task (including moving between columns)
router.patch("/:id", async (req, res) => {
  try {
    const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Reorder tasks within a column
router.patch("/reorder/:columnId", async (req, res) => {
  try {
    const { tasks } = req.body;
    const updates = tasks.map((taskId, index) => ({
      updateOne: {
        filter: { _id: taskId },
        update: { order: index },
      },
    }));
    await TaskModel.bulkWrite(updates);
    res.send({ message: "Tasks reordered successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// In your task routes file (routes/tasks.js)
router.patch("/reorder/:columnId", async (req, res) => {
  try {
    const { columnId } = req.params;
    const { tasks } = req.body; // Array of task IDs in new order

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: "Expected array of task IDs",
      });
    }

    // Create bulk write operations
    const updates = tasks.map((taskId, index) => ({
      updateOne: {
        filter: { _id: taskId, column: columnId },
        update: { order: index },
      },
    }));

    await TaskModel.bulkWrite(updates);

    res.json({
      success: true,
      message: "Tasks reordered successfully",
    });
  } catch (error) {
    console.error("Error reordering tasks:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to reorder tasks",
    });
  }
});


router.delete('/:id', deleteTask)

module.exports = router;
