const express = require('express'); 
const router = express.Router();    
const mongoose = require('mongoose');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/roles');
const Permission= require('../models/permission'); 

const cors = require('cors');

const method = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "optionsSuccessStatus": 200
  };

function parseVar(docs,id){
  var t;
  var temp = [];
  var n = docs.length;
  for(var i = 0;i<n;i++){
    if(id == docs[i].role){
      t = i;
      break;
    }
  }
  tn = docs[t].access.length;
  console.log(tn);
  if(tn != 0){
    for(var i=0;i<tn;i++){
      temp.push(docs[t].access[i]);
      temp.push.apply(temp,parseVar(docs,docs[t].access[i]));
    }
  }
  console.log(temp);
  return temp;
}

function delVar(docs,id){
  var n = docs.length;
  for(var i = 0;i<n;i++){
    var t = docs[i].access;
    for(var j = 0;j<t;j++){
      if(docs[i].access[j]==id){
        docs[i].access.splice(j,1);
        j--;
        t--;
      }
    }
  }
  return docs;
}


router.get("/rolesget/:roleID", cors(method), (req, res, next) => {
  const roleID = parseInt(req.params.roleID);
  Role.find()
    .select(
      "role access"
    )
    .exec()
    .then(docs => {
      // console.log(docs);
      
      var temp = [];
      temp.push(roleID);
      // console.log(parseVar(docs,roleID));
      var tt = parseVar(docs,roleID);
      temp.push.apply(temp,tt);
      
      res.status(200).json(temp);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.get("/rolesdel/:roleID", cors(method), (req, res, next) => {
  const roleID = parseInt(req.params.roleID);
  Role.find()
    .select(
      "role access"
    )
    .exec()
    .then(docs => {
      // console.log(docs[0]);
      Role.remove({ role : req.params.roleID })
      .exec()
      .then()
      .catch();
      docs = delVar(docs,roleID);
      docs.save();
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/roles", cors(method), (req, res, next) => {

Role.find({role : req.body.role})
.then(user => {
    if(user.length >=1){
        
        return res.status(409).json({
        message: "User role already exists"
        });

    }
    const r = new Role({
    _id: new mongoose.Types.ObjectId(),
    role: req.body.role,
    // name: req.body.name,
    access: req.body.access
    });
    return r.save();
})

.then(result => {
    console.log(result);
    res.status(201).json({
    message: "Data stored",
    data: {
        name: result.name,
        role: result.role,
        access: result.access,
        _id: result._id
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


router.post("/roles/add", cors(method), (req, res, next) => {

  const node = req.body.node;
  const child = req.body.child;

  Role.find({role : req.body.node})
  .then(docs => {
    console.log(docs);
  })
  
  .then(result => {
      console.log(result);
      res.status(201).json();
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
      error: err
      });
  });
  });


router.get('/roles/:roleID/:newRole',cors(method), (req, res, next) => {
    
  const roleID = req.params.roleID;
  const newRole = parseInt(req.params.newRole);
  
  Role.find({role: req.params.roleID })
      .select(
        "_id name role access"
      )
      .exec()
      .then(docs => {
        console.log(docs);

        docs[0].access.push(newRole);
        docs[0].save();
        res.status(200).json(docs);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

router.get('/roles/del/:roleID/:newRole',cors(method), (req, res, next) => {
    
  const roleID = req.params.roleID;
  const newRole = parseInt(req.params.newRole);
  
  Role.find({role: req.params.roleID })
      .select(
        "_id name role access"
      )
      .exec()
      .then(docs => {
        console.log(docs);

        // docs[0].access.push(newRole);
        var n = docs[0].access.length;
        for(var i = 0;i<n;i++){
          if(docs[0].access[i]==newRole){
            console.log(docs[0].access);
            docs[0].access.splice(i,1);
            console.log(docs[0].access);
            n--;
            i--;
          }
        }
        docs[0].save();
        res.status(200).json(docs);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});


router.get("/roles/", cors(method), (req, res, next) => {
    Role.find()
      .select(
        "name role access"
      )
      .exec()
      .then(docs => {
        console.log(docs);
        const response = {
          count: docs.length,
          userRoles: docs.map(doc => {
            return {
              // name: doc.name,
              node: doc.role,
              child: doc.access
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

router.get("/rolesget/:roleID", cors(method), (req, res, next) => {
  Role.find()
    .select(
      "role access"
    )
    .exec()
    .then(docs => {
      console.log(docs);
      var n = docs.length;
      var temp = [];

      // const response = {
      //   count: docs.length,
      //   userRoles: docs.map(doc => {
      //     return {
      //       // name: doc.name,
      //       node: doc.role,
      //       child: doc.access
      //     };
      //   })
      // };
      res.status(200).json(docs[0].access);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
  

 router.get("/roles/:roleId", cors(method), (req, res, next) => {
    Role.find({role: req.params.roleId })
      .select(
        "_id name role access"
      )
      .exec()
      .then(docs => {
        console.log(docs);
        const response = {
          count: docs.length,
          userRoles: docs.map(doc => {
            return {
              name: doc.name,
              role: doc.role,
              access: doc.access,
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

router.delete("/roles/:roleId",cors(method), (req, res, next) => {
    
    Role.remove({ role : req.params.roleId })
        .exec()
        .then(result => {

            Permission.remove({ role : req.params.roleId })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "User role deleted"
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
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


router.post("/permissions", cors(method), (req, res, next) => {

    Role.find({ role: req.body.role})
    .then(docs => {
        if(docs.length >=1){
            
            console.log("role ");
            Permission.find({role : req.body.role , route: req.body.route })
            .then(user => {
                if(user.length >=1){
                    
                    return res.status(409).json({
                    message: "Permission role already exists"
                    });
            
                }
                const r = new Permission({
                _id: new mongoose.Types.ObjectId(),
                role: req.body.role,
                route: req.body.route
                });
                return r.save();
            })
            
            .then(result => {
                console.log(result);
                res.status(201).json({
                message: "Data stored",
                data: {
                    role: result.role,
                    route: result.route,
                    _id: result._id
                }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                error: err
                });
            });

    
        }
        else
        return res.status(409).json({
            message: "role does not exists"
            });


    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });


    });



router.get("/permissions/", cors(method), (req, res, next) => {
    Permission.find()
        .select(
        "_id role route"
        )
        .exec()
        .then(docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            rolePermission: docs.map(doc => {
            return {
                role: doc.role,
                route: doc.route,
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

router.get("/permissions/:rId", cors(method), (req, res, next) => {
    Permission.find( { role : req.params.rId})
        .select(
        "_id role route"
        )
        .exec()
        .then(docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            rolePermission: docs.map(doc => {
            return {
                role: doc.role,
                route: doc.route,
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
    

router.delete("/permissions/:permissionId",cors(method), (req, res, next) => {

    Permission.remove({ _id: req.params.permissionId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Permission role deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/permissions/delete",cors(method), (req, res, next) => {

  Permission.remove({ role: req.body.role , route: req.body.route })
      .exec()
      .then(result => {
          res.status(200).json({
              message: "Permission role deleted"
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