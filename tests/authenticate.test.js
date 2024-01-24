const chai = require('chai');
const { expect } = chai;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

// Stub the jwt library for token-related tests
sinon.stub(jwt, 'sign').returns('mocked_token');

const config = require('../config/keys'); 
const { getToken } = require('../authenticate'); 
const authenticate = require('../authenticate');

describe('getToken Function', () => {
  it('should generate a valid JWT token', () => {
    // Sample user object
    const user = {
    _id: 'someUserId',
      username: 'testuser',
    firstname: 'John',
    lastname: 'Doe',
    email: 'johndoe@example.com',
    roll: '12345',
    admin: false
      
    };

   
    const token = getToken(user);
    expect(token).to.be.a('string');

    const decodedToken = jwt.decode(token, config.secretKey);  // Decode the token to verify its contents

    expect(decodedToken).to.have.property('_id', user._id);
    expect(decodedToken).to.have.property('username', user.username);   // Verify that the decoded token has the expected user properties


    //check the token expiration time if expiresIn is set
    // For example, if expiresIn: 3600 is set, the difference should be within a reasonable range
    const expirationTime = decodedToken.exp * 1000; // Convert seconds to milliseconds
    const currentTime = new Date().getTime();
    const timeDifference = expirationTime - currentTime;                  
    expect(timeDifference).to.be.closeTo(3600000, 1000); // within a second of 3600 seconds
  });
});

describe('verifyAdmin Function', () => {
    it('should allow access to an admin user', (done) => {
        const req = { user: { admin: true } };
        const res = {};
        const next = () => {};

        authenticate.verifyAdmin(req, res, () => {
            // No error should be thrown, as admin user should be allowed
            done();
        });
    });

    it('should deny access to a non-admin user', (done) => {
        const req = { user: { admin: false } };
        const res = {};
        const next = () => {};

        authenticate.verifyAdmin(req, res, (err) => {
            // An error with status 403 should be passed to the callback
            expect(err).to.exist;
            expect(err.status).to.equal(403);
            done();
        });
    });

    it('should deny access without a valid JWT token', (done) => {
        const req = {}; // No user property in the request
        const res = {};
        const next = () => {};

        authenticate.verifyAdmin(req, res, (err) => {
            // An error with status 403 should be passed to the callback
            expect(err).to.exist;
            expect(err.status).to.equal(403);
            done();
        });
    });
});

sinon.restore();
