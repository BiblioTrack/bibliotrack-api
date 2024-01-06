const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { expect } = chai;
chai.use(chaiHttp);

// Importing the functions to be tested
const {
  local,
  getToken,
  jwtPassport,
  verifyUser,
  verifyAdmin,
} = require('../authentication');

// Import the User model 
const User = require('../models/users');

// Import the configuration (replace the path accordingly)
const config = require('../config/keys.js');

describe('Authentication Unit Tests', () => {
  describe('local strategy', () => {
    it('should exist', () => {
      expect(local).to.exist;
      expect(local).to.be.an.instanceof(passport.Strategy);
    });

  });

  describe('getToken', () => {
    it('should generate a token', () => {
      const user = { _id: 'someUserId' };
      const token = getToken(user);
      expect(token).to.be.a('string');
    });

  });

  describe('jwtPassport strategy', () => {
    it('should exist', () => {
      expect(jwtPassport).to.exist;
      expect(jwtPassport).to.be.an.instanceof(passport.Strategy);
    });

  });

  describe('verifyUser', () => {
    it('should authenticate a user', (done) => {
      const req = { user: { _id: 'someUserId' } };
      const res = {};
      const next = sinon.spy();

      verifyUser(req, res, () => {
        expect(req.user).to.exist;
        expect(next.called).to.be.true;
        done();
      });
    });

  });

  describe('verifyAdmin', () => {
    it('should authorize an admin user', (done) => {
      const req = { user: { admin: true } };
      const res = {};
      const next = sinon.spy();

      verifyAdmin(req, res, () => {
        expect(next.called).to.be.true;
        done();
      });
    });

    it('should not authorize a non-admin user', (done) => {
      const req = { user: { admin: false } };
      const res = {};
      const next = sinon.spy();

      verifyAdmin(req, res, (err) => {
        expect(err).to.exist;
        expect(err.status).to.equal(403);
        expect(next.called).to.be.false;
        done();
      });
    });

  });
});
