const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const authcheck = require('../middleware/authcheck');

const User = require("../models/user");
const Visit = require("../models/visit");

const cors = require("cors");

const method = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};

router.get("/", cors(method), (req, res, next) => {
  Visit.find()
    .select(
      "student doctor diagnosis date medicine comment bp bmi weight pulse"
    )
    .populate("student", "name emailID mobileNo")
    .populate("doctor", "name emailID mobileNo")
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        visits: docs.map(doc => {
          return {
            doctor: doc.doctor,
            diagnosis: doc.diagnosis,
            _id: doc._id,
            date: doc.date,
            comment: doc.comment,
            medicine: doc.medicine,
            student: doc.student,
            bp: doc.bp,
            pulse: doc.dp,
            bmi: doc.pulse,
            weight: doc.weight
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
      const visit = new Visit({
        _id: new mongoose.Types.ObjectId(),
        doctor: req.body.doctorID,
        diagnosis: req.body.diagnosis,
        comment: req.body.comment,
        medicine: req.body.medicine,
        student: req.body.studentID,
        bp: req.body.bp,
        pulse: req.body.pulse,
        weight: req.body.weight,
        bmi: req.body.bmi
      });
      return visit.save();
    })

    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Data stored",
        data: {
          doctor: result.doctor,
          date: result.date,
          _id: result._id,
          diagnosis: result.diagnosis,
          medicine: result.medicine,
          student: result.student,
          bp: result.bp,
          weight: result.weight,
          bmi: result.bmi,
          pulse: result.pulse
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

router.get("/:studentId", cors(method), (req, res, next) => {
  const id = req.params.studentId;
  Visit.find({ student: id })
    .select(
      "doctor date _id student diagnosis medicine comment bp bmi weight pulse "
    )
    .populate("doctor", "name")
    .exec()
    .then(doc => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          visit: doc
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
router.get("/d/:doctorId", cors(method), (req, res, next) => {
  const id = req.params.doctorId;
  Visit.find({ doctor: id })
    .select(
      "doctor date _id student diagnosis medicine comment bp bmi weight pulse"
    )
    .populate("doctor", "name")
    .exec()
    .then(doc => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          visit: doc
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
router.get("/:studentId/:doctorId", cors(method), (req, res, next) => {
  const id = req.params.doctorId,
    ID = req.params.studentId;
  Visit.find({ doctor: id, student: ID })
    .select(
      "doctor date _id student diagnosis medicine comment bp bmi weight pulse "
    )
    .populate("doctor", "name")
    .exec()
    .then(doc => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          visit: doc
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

router.patch("/:visitId", cors(method), (req, res, next) => {
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
        message: "updated"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:visitId", cors(method), (req, res, next) => {
  const id = req.params.visitId;
  Visit.remove({ _id: id })
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
