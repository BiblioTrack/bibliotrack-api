const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('./index');
const bookRouter = require('./routes/api/bookRouter');


chai.use(chaiHttp);

describe('Main Entry Point', () => {
  it('should start the server successfully', (done) => {
    chai.request(app)
      .get('/api/books', bookRouter)
      .end((_err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});