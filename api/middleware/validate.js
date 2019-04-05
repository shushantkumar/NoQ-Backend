const jwt = require('jsonwebtoken');
var roles=require("./roles");
var exceptionCRT = "/court/";

module.exports = (req, res, next) => {

    try {console.log("Here ",req.headers.authorization);
        var url=req.url;
        var rm="";
        var r={ };
        if(url.search(exceptionCRT)!=-1)url=exceptionCRT;
        console.log("Here", url);
        if(typeof req.headers.authorization !== 'undefined')
        { 
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        rm+=decoded.id;
        r= roles[decoded.sessionvar];
        } 
        else
        r= roles[444];
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
