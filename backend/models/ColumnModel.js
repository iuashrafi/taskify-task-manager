const mongoose = require("mongoose");

const ColumnSchema = new mongoose.Schema({
  title: {
    type : String,
    required : [ true, 'Title is required']
},
tasks : [{
    type : mongoose.Schema.Types.ObjectId, ref : 'Task'
}]
  
  // user_id
});

const ColumnModel = mongoose.model("Column", ColumnSchema);

module.exports = ColumnModel;
