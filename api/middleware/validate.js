const jwt = require('jsonwebtoken');
var roles=require("./roles");

module.exports = (req, res, next) => {

    try {console.log("Here ",req.headers.authorization);
        var url=req.url;
        var rm="";
        var r={ };
        var crt="/court/"; 
        if(url.search(crt)!=-1)url=crt;
        console.log("Here", url);
        if(typeof req.headers.authorization !== 'undefined')
        { 
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        rm+=decoded.id;
        r= roles[decoded.role];
        } 
        else
        r= roles["guest"];
        url=url.replace(rm,"");        

        if(r[url]=== true)
        {
        console.log("Success ");
        next();
        }
        else
        throw 'Validation failed';
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Validation failed'
        });
    }

};