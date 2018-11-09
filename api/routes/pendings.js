const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const authcheck = require('../middleware/authcheck');

const User = require("../models/user");
const Pending = require("../models/pending");

const cors = require("cors");
const method = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};

router.get("/dummy", cors(method), (req, res, next) => {
  Pending.find({ _id: "5bb927c17af6db2b481f5d53" })
    .select("student doctor token date approx_date flag")
    .populate("student", "name emailID mobileNo")
    .populate("doctor", "name emailID mobileNo")
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        pendings: docs.map(doc => {
          return {
            _id: doc._id,
            date: doc.date,
            approx_date: doc.approx_date,
            token: doc.token,
            doctor: doc.doctor,
            student: doc.student,
            flag: doc.flag
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

router.get("/", cors(method), (req, res, next) => {
  Pending.find({ flag: "-1" })
    .select("student doctor token date approx_date flag")
    .populate("student", "name emailID mobileNo")
    .populate("doctor", "name emailID mobileNo")
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        pendings: docs.map(doc => {
          return {
            _id: doc._id,
            date: doc.date,
            approx_date: doc.approx_date,
            token: doc.token,
            doctor: doc.doctor,
            student: doc.student,
            flag: doc.flag
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

router.get("/0", cors(method), (req, res, next) => {
  Pending.find({ flag: "0" })
    .select("student doctor token date approx_date flag")
    .populate("student", "name emailID mobileNo")
    .populate("doctor", "name emailID mobileNo")
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        pendings: docs.map(doc => {
          return {
            _id: doc._id,
            date: doc.date,
            approx_date: doc.approx_date,
            token: doc.token,
            doctor: doc.doctor,
            student: doc.student,
            flag: doc.flag
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
router.post("/dummy", cors(method), (req, res, next) => {
  const pend = new Pending({
    _id: "5bb927c17af6db2b481f5d53",
    token: "0"
  });

  pend
    .save()
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
          student: result.student,
          flag: result.flag
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

router.post("/", cors(method), (req, res, next) => {
  var tok;
  var upt = {};
  Pending.find({ _id: "5bb927c17af6db2b481f5d53" })
    .select("date token")
    .exec()
    .then(docs => {
      console.log(docs);
      const var1 = docs[0].date.getDate();
      const var2 = new Date();
      // console.log("var1", var1, "var 2", var2.getDate());
      if (var1 != var2.getDate()) {
        console.log("Reset ");
        tok = 1;
        upt["date"] = var2;
        upt["token"] = tok;
      } else {
        tok = docs[0].token + 1;
        upt["token"] = tok;
        // console.log("docs[0].token + 1:", docs[0].token + 1);
      }
      console.log(upt);
      console.log("tok1: ", tok);
      Pending.update({ _id: "5bb927c17af6db2b481f5d53" }, { $set: upt })
        .exec()
        .then()
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });

      User.findById(req.body.studentID)
        .then(user => {
          if (!user) {
            return res.status(404).json({
              message: "User not found"
            });
          }
          const pend = new Pending({
            _id: new mongoose.Types.ObjectId(),
            doctor: req.body.doctorID,
            approx_date: req.body.approx_date,
            token: req.body.token,
            student: req.body.studentID,
            flag: req.body.flag,
            token: tok
          });

          return pend.save();
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
              student: result.student,
              flag: result.flag
            }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(566).json({
            error: err
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(555).json({
        error: err
      });
    });
});

router.get("/:doctorID", cors(method), (req, res, next) => {
  const id = req.params.doctorID;
  Pending.find({ doctor: id, flag: "0" })
    .select("student doctor token date approx_date flag")
    .populate("student", "name emailID mobileNo")
    .exec()
    .then(doc => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          pending: doc
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

router.get("/s/:studentID", cors(method), (req, res, next) => {
  const id = req.params.studentID;
  Pending.find({ student: id })
    .select("student doctor token date approx_date flag")
    .populate("doctor", "name emailID mobileNo")
    .populate("student", "name")
    .exec()
    .then(doc => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          pending: doc
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

router.delete("/:pendId", cors(method), (req, res, next) => {
  const id = req.params.pendId;
  Pending.remove({ _id: id })
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

router.patch("/:pendId", cors(method), (req, res, next) => {
  /*res.status(200).json({
      message: 'Updated product!'
  });*/

  const id = req.params.pendId;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Pending.update({ _id: id }, { $set: updateOps })
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

module.exports = router;
