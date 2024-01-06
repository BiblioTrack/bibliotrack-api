const chai = require('chai');
const expect = chai.expect;
const auth = require('../authenticate');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const request = require('supertest');
const sandbox = sinon.createSandbox();
const mongoose = require('mongoose');
const Book = require('../models/books');
const { response } = require('express');


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

        let sampleBook, newBook;

        beforeEach(() => {
            sampleBook = {
                name: 'Test Book',
                author: 'Test Author',
                description: 'Test description',
                isbn: '1234567890123',
                cat: 'Fiction',
                shelf: 5,
                copies: 1,
                publishYear: 2023,
                editor: 'Test Editor',
                language: 'English'
                // Add other fields as needed for the test
              };
          
            newBook = new Book(sampleBook);

            sandbox.stub(Book, 'create').resolves(sampleBook);
        })

        it('POST / should create a new book', (done) => {
              request(app)
                .post('/api/books')
                .expect(200)
                .end((err, response) => {
                    expect(response.body.name).to.equal(newBook.name);
                    expect(response.body.author).to.equal(newBook.author);
                    done(err);
                });
        });

        it('DELETE / should return an error', (done) => {
            request(app)
                .delete('/api/books')
                .expect(403)
                .end((err, response) => {
                    expect(response.statusCode).to.equal(403);
                    done(err);
                });
        });

        it('PUT / should return an error', (done) => {
            request(app)
                .put('/api/books')
                .expect(403)
                .end((err, response) => {
                    expect(response.statusCode).to.equal(403);
                    done(err);
                });
        });
    })
})