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

const mongoURI = require('../config/keys').mongoTestURI;

describe('Testing book routes', () => {
    let app, mongoServer;

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

        let sampleBook, newBook, books;

        before(async () => {
            await mongoose.connect(mongoURI, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
          });

        after(async () => {
            await mongoose.disconnect();
            await mongoose.connection.close();
        });

        beforeEach(async() => {
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
        });

        afterEach(async () => {
            await Book.deleteMany({});
          });

        it('should fetch all books', async () => {
            const savedBook1 = await newBook.save();
            let tmpBook = { ...sampleBook, name: 'Test Book 1', isbn: '1234567890124'};
            let newBook1 = new Book(tmpBook);
            const savedBook2 = await newBook1.save();

            books = [
                savedBook1.toObject(),
                savedBook2.toObject(),
            ];

            const response = await request(app).get('/api/books');
            const responseNames = response.body.map(book => book.name);
            const responseIsbns = response.body.map(book => book.isbn);

            expect(response.status).to.equal(200);
            expect(responseNames).to.include.members(books.map(book => book.name));
            expect(responseIsbns).to.include.members(books.map(book => book.isbn));

    });

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