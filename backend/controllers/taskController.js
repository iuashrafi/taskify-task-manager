const ColumnModel = require("../models/ColumnModel");
const TaskModel = require("../models/TaskModel");

// tested
exports.createTask = async (req, res) => {
  try {
    const {userId} = req.user; 

    const { title, content, columnId, priority } = req.body;

    const column = await ColumnModel.findOne({ _id: columnId, user : userId });
    if (!column) {
      throw new Error("Column doesnt exists!");
    }

    const taskCount = await TaskModel.countDocuments({ column , user: userId });

    const task = new TaskModel({
      title,
      content,
      column,
      order: taskCount,priority,
      user : userId
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


 // tested
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
