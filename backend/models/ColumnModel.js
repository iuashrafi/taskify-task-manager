const mongoose = require("mongoose");

const ColumnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  order: {
    type: Number,
    default: 0,
    index : true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Column", ColumnSchema);
