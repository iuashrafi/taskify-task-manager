const ColumnModel = require("../models/ColumnModel");

exports.createColumn = async (req, res) => {
  try {
    const { title } = req.body;
    const col = new ColumnModel({
      title,
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
