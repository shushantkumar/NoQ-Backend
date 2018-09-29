const mongoose = require('mongoose');

const visitSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user : { type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    doctorName: {type:String,required:true},
    diagnosis:{type:String, required:true},
    comment:{type:String, required:true},
    date: { type: Date, default: Date.now },
    medicine :[{
        medicineName : {type:String,required:true},
        duration: {type:String,required:true},
        dosage: {type:String, required:true}
    }]
});

module.exports = mongoose.model('Visit', visitSchema);