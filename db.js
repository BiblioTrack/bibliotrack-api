// db.js
const mongoose = require('mongoose');
const mongoURI = require('./config/keys').mongoURI;

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

module.exports = mongoose;
