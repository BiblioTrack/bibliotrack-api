/**
 * userRouter.js
 * Routes for user authentication and management.
 */

// GET /: Fetches all users (accessible by admin).
// PUT /:userId: Updates user details by ID (accessible by authenticated users).
// PUT /password/:userId: Updates user password by ID (accessible by authenticated users, except admin).
// POST /signup: Creates a new user account.
// POST /login: Logs in a user and generates a JWT token for authentication.
// GET /logout: Logs out a user session.
// GET /checkJWTtoken: Checks the validity of the JWT token for user authentication.


const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/users');
const passport = require('passport');
const authenticate = require('../../authenticate');
const cors = require('cors'); // Import cors package directly


router.use(bodyParser.json());

router.options('*', cors(), (req, res) => { res.sendStatus(200); });

router.get('/', cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
      .then((users) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(users);
      })
      .catch((err) => next(err));
});


router.put('/:userId', cors(), authenticate.verifyUser, (req, res, next) => {
  User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true })
      .then((user) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user);
      })
      .catch((err) => next(err));
});

router.put('/password/:userId', cors(), authenticate.verifyUser, (req, res, next) => {
  User.findById(req.params.userId)
      .then((user) => {
          if (user && !user.admin) {
              user.setPassword(req.body.password, function () {
                  user.save();
                  res.status(200).json({ message: 'password changed successfully' });
              });
          } else if (!user) {
              res.status(500).json({ message: "User doesn't exist" });
          } else {
              res.status(400).json({ message: "Password of an admin can't be changed this way.\nContact the webmaster" });
          }
      })
      .catch((err) => next(err));
});

router.post('/signup', cors(), (req, res, next) => {
  User.register(
      new User({
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
          email: req.body.email,
          role: req.body.role,
          admin: req.body.admin
      }),
      req.body.password,
      (err, user) => {
          if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({ err: err });
          } else {
            user.save()
            .then((savedUser) => {
              passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, status: 'Registration Successful!' });
              });
            })
            .catch((err) => {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({ err: err });
            });
          
          }
      }
  );
});

router.post('/login', cors(), passport.authenticate('local'), (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);

      if (!user) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: false, status: 'Login Unsuccessful!', err: info });
      }
      req.logIn(user, (err) => {
          if (err) {
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!' });
          }

          var token = authenticate.getToken({ _id: req.user._id });
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Login Successful!', token: token, userinfo: req.user });
      });
  })(req, res, next);
});

router.get('/logout', cors(), authenticate.verifyUser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, message: 'Logout successful' });
  });
  

router.get('/checkJWTtoken', cors(), (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) return next(err);

      if (!user) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          return res.json({ status: 'JWT invalid!', success: false, err: info });
      } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.json({ status: 'JWT valid!', success: true, user: user });
      }
  })(req, res);
});

module.exports = router;
   