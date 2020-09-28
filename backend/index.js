const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Connect to Database
mongoose.connect(config.database, {useNewUrlParser: true}).
catch(error => console.log(error));

//On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to db');
})

//On Error
mongoose.connection.on('error', (err) => {
    console.log('DB Error: '+err);
})

const app = express();
const users = require('./routes/users');
const subjects = require('./routes/subjects');
const documents = require('./routes/documents');

//Port
const port = process.env.PORT || 3000;

const whitelist = ['http://localhost:4200'];

//Cross-Origin Resource Sharing Middleware
app.use(cors());

//Body Parser
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users', users);
app.use('/subjects', subjects);
app.use('/documents', documents);

//Index Route
app.get('/', (req, res) => {
    res.send('Invalid endpoint');
})

var server = app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});