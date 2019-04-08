const mongoose = require("mongoose");

const permissionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    role: { type: Number, required: true },
    pno: { type: Number, required: true }
});

module.exports = mongoose.model("Permission", permissionSchema);
