const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String,required:true},
    mobileNo: {type:Number, required:true},
    emailID: {type:String, required:true},
    password: { type: String, required:true},
    address: {type:String, required:true }
});

module.exports = mongoose.model('User', userSchema);