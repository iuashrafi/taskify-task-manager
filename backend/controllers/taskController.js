const ColumnModel = require("../models/ColumnModel");
const TaskModel = require("../models/TaskModel");

exports.createTask = async (req, res) => {
  try {
    const { userId } = req.user;

    const { title, content, columnId, priority } = req.body;

    const column = await ColumnModel.findOne({ _id: columnId, user: userId });
    if (!column) {
      throw new Error("Column doesnt exists!");
    }

    const taskCount = await TaskModel.countDocuments({ column, user: userId });

    const task = new TaskModel({
      title,
      content,
      column,
      order: taskCount,
      priority,
      user: userId,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.log("error creating task in db", error);
    res.status(500).json({
      message: "Error creating task in db",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await TaskModel.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

exports.updateTask = async (req, res) => {
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
};

exports.reorderTasksWithinCol = async (req, res) => {
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
};

exports.renameProject = async (req, res) => {
  try {
    const { projectName } = req.body;
    const userId = req.user.userId;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { projectName },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Project name updated",
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating project name", error });
  }
};
