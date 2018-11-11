const mongoose = require("mongoose");

const spSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  eventname: { type: String },
  emailID: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  mobileNo: { type: Number },
  eventtype: { type: String },
  date: { type: Date, default: Date.now },
  description: { type: String }
});

module.exports = mongoose.model("Sp", spSchema);
