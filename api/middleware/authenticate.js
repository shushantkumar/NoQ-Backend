const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Role = require('../models/roles');
const Permission= require('../models/permission'); 
var exceptionCRT = "/court/";

module.exports = (req, res, next) => {

    try {
        var url=req.url;
        var rm="";
        var r={ };
        if(url.search(exceptionCRT)!=-1)url=exceptionCRT;
        console.log("Here", url);

        var sessionvar=444;
        if(typeof req.headers.authorization !== 'undefined')
        { 
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        rm+=decoded.id;
        sessionvar=decoded.sessionvar;
        } 
        url=url.replace(rm,""); 
        console.log("decoded msg",sessionvar);
        
        var access=[];

        Role.find({ role : sessionvar })
        .select("_id name role access")
        .exec()
        .then(docs => {
            console.log(docs);
            access= docs[0].access;
            console.log("acess docs");

            console.log("access role",access);

            Permission.find({ role : { $in : access } , route : url})
            .select("_id role route")
            .exec()
            .then(docu => {
                
                console.log("permission",docu);
                console.log("hello");
                
                if(docu.length>=1)
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
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Validation failed'
        });
    }

};
