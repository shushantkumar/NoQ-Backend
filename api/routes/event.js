const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");
const Sac = require("../models/sac");
const Sja = require("../models/sja");
const Sp = require("../models/sp");

const cors = require("cors");
const method = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};

router.post("/sac", cors(method), (req, res, next) => {
   
    const sac = new Sac({
      _id: new mongoose.Types.ObjectId(),
      eventname: req.body.eventname,
      emailID: req.body.emailID,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mobileNo: req.body.mobileNo,
      eventtype: req.body.eventtype,
      date: req.body.date,
      description: req.body.description
    });

    sac
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
        message: "Data saved",
        Details: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
        error: err
        });
    });
  
});


router.post("/sja", cors(method), (req, res, next) => {

const sja = new Sja({
  _id: new mongoose.Types.ObjectId(),
  eventname: req.body.eventname,
  emailID: req.body.emailID,
  firstname: req.body.firstname,
  lastname: req.body.lastname,
  mobileNo: req.body.mobileNo,
  eventtype: req.body.eventtype,
  date: req.body.date,
  description: req.body.description
});

sja
.save()
.then(result => {
    console.log(result);
    res.status(201).json({
    message: "Data saved",
    Details: result
    });
})
.catch(err => {
    console.log(err);
    res.status(500).json({
    error: err
    });
});
});

router.post("/sp", cors(method), (req, res, next) => {

const sp = new Sp({
  _id: new mongoose.Types.ObjectId(),
  eventname: req.body.eventname,
  emailID: req.body.emailID,
  firstname: req.body.firstname,
  lastname: req.body.lastname,
  mobileNo: req.body.mobileNo,
  eventtype: req.body.eventtype,
  date: req.body.date,
  description: req.body.description
});

sp        
.save()
.then(result => {
    console.log(result);
    res.status(201).json({
    message: "Data saved",
    Details: result
    });
})
.catch(err => {
    console.log(err);
    res.status(500).json({
    error: err
    });
});
});

router.get('/sja',cors(method),(req,res,next)=>{

Sja.find()
.select()  
.exec()
.then(docs => {
    console.log(docs);
    const response = {
        count: docs.length,
        users: docs.map(doc => {
        return {
            _id: doc._id,
            eventname: doc.eventname,
            emailID: doc.emailID,
            firstname: doc.firstname,
            lastname: doc.lastname,
            mobileNo: doc.mobileNo,
            eventtype: doc.eventtype,
            date: doc.date,
            description: doc.description
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


router.get('/sac',cors(method),(req,res,next)=>{

Sac.find()
.select()  
.exec()
.then(docs => {
    console.log(docs);
    const response = {
        count: docs.length,
        users: docs.map(doc => {
        return {
            _id: doc._id,
            eventname: doc.eventname,
            emailID: doc.emailID,
            firstname: doc.firstname,
            lastname: doc.lastname,
            mobileNo: doc.mobileNo,
            eventtype: doc.eventtype,
            date: doc.date,
            description: doc.description
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

router.get('/sp',cors(method),(req,res,next)=>{

Sp.find()
.select()  
.exec()
.then(docs => {
    console.log(docs);
    const response = {
        count: docs.length,
        users: docs.map(doc => {
        return {
            _id: doc._id,
            eventname: doc.eventname,
            emailID: doc.emailID,
            firstname: doc.firstname,
            lastname: doc.lastname,
            mobileNo: doc.mobileNo,
            eventtype: doc.eventtype,
            date: doc.date,
            description: doc.description
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

  module.exports = router;