const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  approx_date: { type: Date },
  token: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
