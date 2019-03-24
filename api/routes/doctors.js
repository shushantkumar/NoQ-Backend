const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");

const cors = require("cors");

const method = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};
router.get("/", cors(method), (req, res, next) => {
  Doctor.find()
    .select()
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        doctors: docs.map(doc => {
          return {
            name: doc.name,
            mobileNo: doc.mobileNo,
            emailID: doc.emailID,
            specialization: doc.specialization,
            _id: doc._id
          };
        })
      };
      if (docs.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No entries found"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/signup", cors(method), (req, res, next) => {
  Doctor.find({ emailID: req.body.emailID })
    .exec()
    .then(doctor => {
      if (doctor.length >= 1) {
        return res.status(409).json({
          message: "Account already exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              error: err
            });
          } else {
            const doctor = new Doctor({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              emailID: req.body.emailID,
              mobileNo: req.body.mobileNo,
              specialization: req.body.specialization,
              password: hash
            });

            doctor
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "Doctor saved",
                  Details: result
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.get("/:doctorId", cors(method), (req, res, next) => {
  const id = req.params.doctorId;
  Doctor.findById(id)
    .select("name emailID mobileNo _id doctor specialization")
    .exec()
    .then(doc => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          doctor: doc
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

router.post("/login", cors(method), (req, res, next) => {
  Doctor.find({ emailID: req.body.emailID })
    .exec()
    .then(doctor => {
      if (doctor.length < 1) {
        return res.status(401).json({
          message: "Login failed"
        });
      }
      bcrypt.compare(req.body.password, doctor[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Login failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              emailID: doctor[0].emailID,
              id: doctor[0]._id,
              role: "doctor"
            },
            "secret",
            { expiresIn: "2h" }
          );

          return res.status(200).json({
            message: "Login Successful",
            doctorID: doctor[0]._id,
            token: token
          });
        }
        res.status(401).json({
          message: "Login failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:doctorId", cors(method), (req, res, next) => {
  Doctor.remove({ _id: req.params.doctorId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Doctor deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:doctorId", cors(method), (req, res, next) => {
  const id = req.params.doctorId;
  const updateOps = {};
  //this loop to check which one to patch
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Doctor.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "doctor updated"
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
