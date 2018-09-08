const express = require('express'); //same as importing express service
const app = express();              //this starts all application of express
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const method = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "optionsSuccessStatus": 200
  };

// const mongoDB = 'mongodb://127.0.0.1/emerenvendre';
// mongoose.connect(mongoDB);
// mongoose.Promise= global.Promise;       //to remove some warning

app.use(morgan('dev'));
app.use(cors(method));
app.use(bodyParser.urlencoded({ extended: false }));   
app.use(bodyParser.json());

const mongoDB = 'mongodb://user1:user11@ds249942.mlab.com:49942/itaproject';
mongoose.connect(mongoDB, { useNewUrlParser: true } , (err, db) => {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });
mongoose.Promise= global.Promise;

app.get('/', (req, res) => res.send('Hello World!'));

//to handle errors anything getting past above two
app.use((req, res, next) => {
    const error = new Error('Not found');       //Error is by default to handle errors
    error.status = 404;
    next(error);
})

//this is for any errors in the setup used in db
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message          //message is general property of returning message 
        }
    });
});

/*
//any request is passed through app
app.use((req, res, next) => {
    res.status(200).json({          //sending a json response status here 
        message: 'It works!'        //the message
    });
});
*/
module.exports = app; //this basically exports