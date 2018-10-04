const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const authcheck = require('../middleware/authcheck');

const User = require("../models/user");
const Appointment = require("../models/appointment");

const cors = require("cors");

const method = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};

router.get("/", cors(method), (req, res, next) => {
  Appointment.find()
    .select("student doctor token date approx_date")
    .populate("student", "name emailID mobileNo")
    .populate("doctor", "name emailID mobileNo")
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        appointments: docs.map(doc => {
          return {
            _id: doc._id,
            date: doc.date,
            approx_date: doc.approx_date,
            token: doc.token,
            doctor: doc.doctor,
            student: doc.student
          };
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

router.post("/", cors(method), (req, res, next) => {
  User.findById(req.body.studentID)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      const appoint = new Appointment({
        _id: new mongoose.Types.ObjectId(),
        doctor: req.body.doctorID,
        approx_date: req.body.approx_date,
        token: req.body.token,
        student: req.body.studentID
      });
      return appoint.save();
    })

    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Data stored",
        data: {
          doctor: result.doctor,
          date: result.date,
          approx_date: result.approx_date,
          _id: result._id,
          token: result.token,
          student: result.student
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

router.get("/:doctorID", cors(method), (req, res, next) => {
  const id = req.params.doctorID;
  Appointment.find({ doctor: id })
    .select("student doctor token date approx_date")
    .populate("student", "name emailID mobileNo")
    .exec()
    .then(doc => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          appointment: doc
        });
      } else {
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

router.delete("/:Id", cors(method), (req, res, next) => {
  const id = req.params.Id;
  Appointment.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "deleted"
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
