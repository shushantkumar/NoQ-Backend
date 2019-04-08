const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Role = require('../models/roles');
const Permission= require('../models/permission'); 
const Pertype= require('../models/pertype');
var exceptionCRT = "/court/";
var g="GET";
var p1="POST";
var p2="PATCH";
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

  function parseVar2(docs){
    var t;
    var temp = [];
    var n = docs.length;;
    if(n != 0){
      for(var i=0;i<n;i++){
        temp.push(docs[i].pno);
      }
    }
    console.log(temp);
    return temp;
  }

module.exports = (req, res, next) => {

    try {
        var url=req.url;
        var rm="";
        var r={ };
        if(url.search(exceptionCRT)!=-1)url=exceptionCRT;
        console.log("Here", url);
        var ttype="";
        if(req.method==g)
        ttype="read";
        else
        ttype="write"
        console.log("ttype",ttype);
        var sessionvar=444;
        if(typeof req.headers.authorization !== 'undefined')
        { 
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        sessionvar=decoded.sessionvar;
        } 
         
        console.log("decoded msg",url);
        
        var access=[];

        Role.find({ })
        .select("role access")
        .exec()
        .then(docs => {
            console.log(docs);
            var temp = [];
            temp.push(sessionvar);
            var tt = parseVar(docs,sessionvar);
            temp.push.apply(temp,tt);
            console.log(temp);

            Permission.find({ role : { $in : temp } })
            .select(" role pno")
            .exec()
            .then(docu => {
                
                console.log(docu);
                var temp2= parseVar2(docu);
                console.log("permission",docu);
                console.log("hello");
                console.log(url);
                Pertype.find({ pno : { $in : temp2 } , route : url , type: ttype })
                .select(" route pno type")
                .exec()
                .then(doct => {
                    
                    console.log(doct);
                    if(doct.length>=1)
                    next();
                    else
                    throw 'Validation failed';
    
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
            // next();
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
            });
        });
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Validation failed'
        });
    }

};
