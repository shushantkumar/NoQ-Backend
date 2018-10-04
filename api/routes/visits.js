const express = require('express'); 
const router = express.Router();    
const mongoose = require('mongoose');
// const authcheck = require('../middleware/authcheck');

const User = require('../models/user');
const Visit = require('../models/visit');

const cors = require('cors');

const method = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "optionsSuccessStatus": 200
  };


router.get('/',cors(method), (req, res, next) => {
    Visit.find()
    .select('user doctorName diagnosis date medicine comment')
    .populate('user',"name emailID mobileNo")
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            visits: docs.map(doc => {
                return {
                    doctorName: doc.doctorName,
                    diagnosis: doc.diagnosis,
                    _id: doc._id,
                    date: doc.date,
                    comment: doc.comment,
                    medicine: doc.medicine, 
                    user: doc.user
            
                }
            })
        };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.post('/',cors(method), (req, res, next) => {
    User.findById(req.body.userID)
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const visit = new Visit({
            _id: new mongoose.Types.ObjectId(),
            doctorName: req.body.doctorName,
            diagnosis:req.body.diagnosis,
            comment:req.body.comment,
            medicine:req.body.medicine,
            user: req.body.userID
        });
        return visit.save();
    })
    
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Data stored",
            data: {
                doctorName: result.doctorName,
                date: result.date,
                _id: result._id,
                diagnosis: result.diagnosis,
                user:result.user,
            
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.get('/:userId',cors(method),(req, res, next) => {
    const id = req.params.userId;
    Visit.find({ user : id })
    .select('doctorName date _id user diagnosis medicine comment ')
    .exec()
    .then(doc => {
        console.log("From database", doc);

       
        if (doc) {
            res.status(200).json({
                visit: doc      
            });
        } 
        else {
            res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    }); 
});


router.patch('/:visitId',cors(method), (req, res, next) => {
    /*res.status(200).json({
        message: 'Updated product!'
    });*/

    const id = req.params.visitId;
    const updateOps = {};

    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Visit.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'updated',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:visitId',cors(method),(req, res, next) => {
    const id = req.params.visitId;
    Visit.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
            message: 'deleted'
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