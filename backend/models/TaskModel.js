const mongoose = require("mongoose");
 

const TaskSchema = new mongoose.Schema({
  title: {
    type : String,
    required : [ true, 'Title is required']
},
  content: String,
  is_completed: Boolean, 
  column : {
    required : [true, 'Column is required'],
    type : mongoose.Schema.Types.ObjectId, ref : 'Column'}
  // priority
  // user_id
  // project_id
});

const TaskModel = mongoose.model("Task", TaskSchema);

module.exports = TaskModel;
