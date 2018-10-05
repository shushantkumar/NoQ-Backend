const mongoose = require("mongoose");

const visitSchema = mongoose.Schema({
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
  diagnosis: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  medicine: [
    {
      medicineName: { type: String, required: true },
      duration: { type: String, required: true },
      dosage: { type: String, required: true }
    }
  ],
  bp: { type: Number },
  pulse: { type: Number },
  weight: { type: Number },
  bmi: { type: Number }
});

module.exports = mongoose.model("Visit", visitSchema);
