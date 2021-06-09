const  mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27018', {
            user:'root',
            pass: 'example',

            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('connected to db')

        app.use(bodyParser.json());
        //import routes middleware
        const boardRoute = require('../routes/router');
        app.use('/', boardRoute);

//listen
app.listen(3001);