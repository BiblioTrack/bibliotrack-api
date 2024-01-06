const chai = require('chai');
const expect = chai.expect;
const auth = require('../authenticate');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const request = require('supertest');
const sandbox = sinon.createSandbox();
const mongoose = require('mongoose');


describe('Testing book routes', () => {
    let app; // Move app variable outside beforeEach to make it accessible in the test cases

    beforeEach(() => {
        // Create spies for verifyUser and verifyAdmin
        sandbox.stub(auth, 'verifyUser').callsFake((req, res, next) => next());
        sandbox.stub(auth, 'verifyAdmin').callsFake((req, res, next) => next());

        // Import the app only once
        app = require('../index');
    });

    after(async () => {
        // Close the Mongoose connection after all tests are done
        await mongoose.connection.close();
      });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Testing / route', () => {
        // TODO

        it('DELETE / should return an error', (done) => {
            request(app)
                .delete('/api/books')
                .expect(403)
                .end((err, response) => {
                    // expect(response.body).to.have.property('message').to.equal('DELETE operation not supported on /books');
                    done(err);
                });
        });
    })
})