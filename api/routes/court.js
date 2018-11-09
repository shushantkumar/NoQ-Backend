const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");
const Court = require("../models/court");

const cors = require("cors");
const method = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};

router.post("/", cors(method), (req, res, next) => {
    var query ={
        courtName: req.body.courtName,
        day: req.body.day,
        month: req.body.month,
        timeslot : req.body.timeslot
    
    }
    Court.findOneAndUpdate(query,{$push: {usersDetails: req.body.studentID}, $inc:{courtBooked: 1} } , {upsert : true })
    .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
            message: ' upsert done'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

router.get('/:day/:month/:sid',cors(method),(req,res,next)=>{

    Court.find({day: req.params.day ,month: req.params.month,usersDetails : req.params.sid})
    .select()  
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {
            
            court: docs.map(doc => {
            return {
                courtName: doc.courtName,
                courtBooked: doc.courtBooked,
                timeslot: doc.timeslot,
                usersDetails: doc.usersDetails,
                day: doc.day,
                month: doc.month,
                created: doc.created,
                _id: doc._id
            };
            })
        };
        res.status(200).json(response);      
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

router.get('/:day/:month/n/:name',cors(method),(req,res,next)=>{

    Court.find({day: req.params.day ,month: req.params.month,courtName : req.params.name})
    .select()  
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {
            
            court: docs.map(doc => {
            return {
                courtName: doc.courtName,
                courtBooked: doc.courtBooked,
                timeslot: doc.timeslot,
                usersDetails: doc.usersDetails,
                day: doc.day,
                month: doc.month,
                created: doc.created,
                _id: doc._id
            };
            })
        };
        res.status(200).json(response);      
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});


router.get('/',cors(method),(req,res,next)=>{

    Court.find()
    .select()  
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            users: docs.map(doc => {
            return {
                courtName: doc.courtName,
                courtBooked: doc.courtBooked,
                timeslot: doc.timeslot,
                usersDetails: doc.usersDetails,
                day: doc.day,
                month: doc.month,
                created: doc.created,
                _id: doc._id
            };
            })
        };
        res.status(200).json(response);

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

router.delete("/",cors(method), (req, res, next) => {
    
    court.remove({  })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;