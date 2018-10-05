const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Reception = require("../models/reception");

const cors = require("cors");

const method = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};
router.get("/", cors(method), (req, res, next) => {
  Reception.find()
    .select()
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        receptions: docs.map(doc => {
          return {
            name: doc.name,
            emailID: doc.emailID,
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

router.post("/", cors(method), (req, res, next) => {
  Reception.find({ emailID: req.body.emailID })
    .exec()
    .then(reception => {
      if (reception.length >= 1) {
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
            const reception = new Reception({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              emailID: req.body.emailID,
              password: hash
            });

            reception
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "Reception saved",
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

router.get("/:receptionId", cors(method), (req, res, next) => {
  const id = req.params.receptionId;
  Reception.findById(id)
    .select("name emailID _id ")
    .exec()
    .then(doc => {
      console.log("From database", doc);

      if (doc) {
        res.status(200).json({
          reception: doc
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
  Reception.find({ emailID: req.body.emailID })
    .exec()
    .then(reception => {
      if (reception.length < 1) {
        return res.status(401).json({
          message: "Login failed"
        });
      }
      bcrypt.compare(
        req.body.password,
        reception[0].password,
        (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Login failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                emailID: reception[0].emailID,
                receptionID: reception[0]._id
              },
              "secret",
              { expiresIn: "2h" }
            );

            return res.status(200).json({
              message: "Login Successful",
              receptionID: reception[0]._id,
              token: token
            });
          }
          res.status(401).json({
            message: "Login failed"
          });
        }
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:receptionId", cors(method), (req, res, next) => {
  Reception.remove({ _id: req.params.receptionId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Reception deleted"
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
