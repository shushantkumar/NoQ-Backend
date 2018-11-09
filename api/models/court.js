const mongoose = require("mongoose");

const courtSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  usersDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  courtName: { type: String },
  courtBooked: { type: Number },
  timeslot: { type: Number },
  day: { type: Number },
  month: { type: Number },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Court", courtSchema);
