const mongoose = require("mongoose");

const pendingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  approx_date: { type: Date },
  token: { type: Number, default: 1 },
  date: { type: Date, default: Date.now },
  flag: { type: Number }
  // createdAt: { type: Date, expires: "10m", default: Date.now }
});

module.exports = mongoose.model("Pending", pendingSchema);
