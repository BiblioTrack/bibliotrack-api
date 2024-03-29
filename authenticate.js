var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config/keys.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

// For sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        console.log("JWT payload: ", jwt_payload);
        const user = await User.findOne({ _id: jwt_payload._id });
  
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = function (req, res, next){
    if(req.user && req.user.admin){
        next();
    }else{
        var err = new Error('You are not authorized!');
        err.status = 403;
        return next(err);
    }
};
