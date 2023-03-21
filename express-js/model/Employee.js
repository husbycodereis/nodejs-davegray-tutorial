const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});
//mongoose autmatically converts uppercase singular model name into lowercase plural one
module.exports = mongoose.model("Employee", employeeSchema);
