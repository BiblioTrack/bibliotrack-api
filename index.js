const express = require('express');
const cors = require('cors');
const mongoose = require('./db'); 
const bodyParser = require('body-parser');
const path = require('path');
var passport = require('passport');
var authenticate = require('./authenticate');
const session = require('express-session');


// Loading routers
const bookRouter = require('./routes/api/bookRouter');
const userRouter = require('./routes/api/userRouter');
const issueRouter = require('./routes/api/issueRouter');
const bookRequestRouter = require('./routes/api/bookRequestRouter');


const app= express();


// Use CORS middleware directly
app.use(cors());

app.use(session({
  secret: 'e3c9a2f82c0b89ec06e26a33e7126cfd59d1398a27f7b3f613a2e428e781b8df', // Replace with your generated key
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});

// Bodyparser Middleware
app.use(bodyParser.json());

app.use(passport.initialize());

// Use routes
app.use('/api/books',bookRouter);
app.use('/api/users',userRouter);
app.use('/api/issues',issueRouter);
app.use('/api/bookRequests',bookRequestRouter);


// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

// Add an error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, error: err.message });
});

const port = process.env.PORT || 8080;


var server = app.listen(port, ()=> console.log(`Server started running on port ${port}`));
console.log(`http://127.0.0.1:${port}`)

module.exports = server
