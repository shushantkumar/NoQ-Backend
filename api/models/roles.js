const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    role: { type: Number, required: true },
    access : [ ]
});

module.exports = mongoose.model("Role", roleSchema);
