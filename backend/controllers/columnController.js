const ColumnModel = require("../models/ColumnModel");
const TaskModel = require("../models/TaskModel");

exports.createColumn = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title } = req.body;
    const columnCount = await ColumnModel.countDocuments({ user: userId });
    const col = new ColumnModel({
      title,
      order: columnCount,
      user: userId,
    });

    await col.save();
    res.status(201).json(col);
  } catch (error) {
    console.log("Error occurred while creating a Column", error);
    res.status(500).json({
      message: "Error occured while creating a Column in db",
    });
  }
};

exports.getColumnsWithTasks = async (req, res) => {
  try {
    const { userId } = req.user;
    const columns = await ColumnModel.find({
      user: userId,
    }).sort("order");

    const columnsWithTasks = await Promise.all(
      columns.map(async (column) => {
        const tasks = await TaskModel.find({
          column: column._id,
          user: userId,
        }).sort("order");
        return {
          ...column.toObject(),
          tasks,
        };
      })
    );

    res.send(columnsWithTasks);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.reorderColumns = async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).send({ message: "Expected an array of updates" });
    }

    await Promise.all(
      updates.map(async (update) => {
        if (!update.id || typeof update.order !== "number") {
          throw new Error("Invalid update format");
        }
        await ColumnModel.findByIdAndUpdate(update.id, { order: update.order });
      })
    );

    res.send({ message: "Columns reordered successfully" });
  } catch (error) {
    console.error("Error reordering columns:", error);
    res
      .status(400)
      .send({ message: error.message || "Failed to reorder columns" });
  }
};

exports.deleteColumn = async (req, res) => {
  try {
    const columnId = req.params.id;

    const column = await ColumnModel.findById(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    await ColumnModel.findByIdAndDelete(columnId);

    await TaskModel.deleteMany({ column: columnId });

    res
      .status(200)
      .json({ message: "Column and associated tasks deleted successfully" });
  } catch (error) {
    console.error("Error deleting column", error);
    res.status(500).json({ message: "Failed to delete column" });
  }
};

exports.updateColumn = async (req, res) => {
  try {
    const columnId = req.params.id;
    const { title } = req.body;
    await ColumnModel.findByIdAndUpdate(columnId, {
      title,
    });

    res.status(200).json({
      success: true,
      message: "Column renamed successfully!",
    });
  } catch (error) {
    console.log("Error occurred while renaming a Column", error);
    res.status(500).json({
      message: "Error occured while renaming a Column in db",
    });
  }
};
