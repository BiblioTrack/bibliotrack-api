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
    let app;

    beforeEach(() => {
        sandbox.stub(auth, 'verifyUser').callsFake((req, res, next) => next());
        sandbox.stub(auth, 'verifyAdmin').callsFake((req, res, next) => next());

        app = require('../index');
    });

    after(async () => {
        await mongoose.connection.close();
        app.close()
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
                    expect(response.statusCode).to.equal(403);
                    done(err);
                });
        });
    })
})