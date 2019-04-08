const mongoose = require("mongoose");

const pertypeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pno: { type: Number, required: true },
    route: { type: String, required: true },
    type: {type: String, required: true }
});

module.exports = mongoose.model("Pertype", pertypeSchema);
