const mongoose = require("mongoose");

const uroleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    role: [ ]
});

module.exports = mongoose.model("Urole", uroleSchema);
