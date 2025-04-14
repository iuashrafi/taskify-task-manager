const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: String,
  is_completed: {
    type: Boolean,
    default: false,
  },
  column: {
    required: [true, "Column is required"],
    type: mongoose.Schema.Types.ObjectId,
    ref: "Column",
  },
  order: {
    type: Number,
    default: 0,
    index: true,
  },
  priority: {
    type: String,
    enum: ["Normal", "Medium", "High"],
    default: "Normal",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Reference to User is required"],
  },
});

module.exports = mongoose.model("Task", TaskSchema);
