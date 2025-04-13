const ColumnModel = require("../models/ColumnModel");
const TaskModel = require("../models/TaskModel");

exports.createTask = async (req, res) => {
  try {
    const { title, content, columnId } = req.body;

    const column = await ColumnModel.findOne({_id : columnId});
    if(!column){
      throw new Error("Column doesnt exists!")
    }

    const task = new TaskModel({
      title,
      content,
      column  
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
