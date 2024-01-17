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

const mongoURI = require('../config/keys').mongoTestURI;

describe('Testing book routes', () => {
    let app;
    let sampleBook, newBook, books;

    before(async () => {
        await mongoose.connect(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
      });

    beforeEach(() => {
        sandbox.stub(auth, 'verifyUser').callsFake((req, res, next) => next());
        sandbox.stub(auth, 'verifyAdmin').callsFake((req, res, next) => next());

        app = require('../index');

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
          };
          
          newBook = new Book(sampleBook);
    });

    after(async () => {
        await mongoose.connection.close();
        app.close()
      });

    afterEach(async() => {
        await Book.deleteMany({});

        sandbox.restore();
    });

    describe('Testing / route', () => {
        beforeEach(async() => {
            sandbox.stub(Book, 'create').resolves(sampleBook);
        });

        it('GET / should fetch all books', async () => {
            const savedBook = await newBook.save();

            const response = await request(app).get('/api/books').expect(200);

            expect(response.body[0])
                .to.have.property("_id")
                .equal(savedBook._id.toString());
    });

        it('POST / should create a new book', (done) => {
              request(app)
                .post('/api/books')
                .expect(200)
                .end((err, response) => {
                    expect(response.body.name).to.equal(newBook.name);
                    expect(response.body.isbn).to.equal(newBook.isbn);
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

    describe('Testing /:bookId route', () => {
        let savedBook;

        beforeEach(async() => {
            savedBook = await newBook.save();
        })

        afterEach(async() => {
            await Book.deleteMany({});
        })

        it('GET /:bookId should fetch a specific book', async() => {
            const response = await request(app)
                .get(`/api/books/${savedBook._id}`)
                .expect(200);

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body._id).to.equal(savedBook._id.toString());
        });

        it('POST /:bookId should fail', async() => {
            await Book.deleteMany({});

            const response = await request(app)
                .post(`/api/books/${savedBook._id}`)
                .send(sampleBook)
                .expect(200);

            expect(response.body.name).to.equal(savedBook.name);
        });

        it('PUT /:bookId should update a specific book', async() => {
            const updatedData = {
                name: 'Updated Book Name',
                author: 'Updated Author',
            };

            const response = await request(app)
                .put(`/api/books/${savedBook._id}`)
                .send(updatedData)
                .set('Accept', 'application/json')
                .expect(200);

            expect(response.body).to.have.property('_id').equal(savedBook._id.toString());
            expect(response.body).to.have.property('name').equal(updatedData.name);
            expect(response.body).to.have.property('author').equal(updatedData.author);
        });

        it('DELETE /:bookId should delete a specific book by ID', async () => {
            const response = await request(app)
              .delete(`/api/books/${savedBook._id}`)
              .expect(200);
        
            expect(response.body).to.have.property('_id').equal(savedBook._id.toString());
            expect(response.body).to.have.property('success').equal(true);
          });
    });
})