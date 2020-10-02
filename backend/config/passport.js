const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./database');

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  passport.use('admin-rule', new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserById(jwt_payload._id, (err, user) => {
      if(err) {
        return done(err, false);
      }

      if(user && user.type == 'admin') {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
  passport.use('worker-rule', new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserById(jwt_payload._id, (err, user) => {
      if(err) {
        return done(err, false);
      }

      if(user && user.type == 'worker') {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
  passport.use('employee-rule', new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserById(jwt_payload._id, (err, user) => {
      if(err) {
        return done(err, false);
      }

      if(user && user.type == 'employee') {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}

