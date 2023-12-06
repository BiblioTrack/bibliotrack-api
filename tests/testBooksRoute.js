const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('C:/Users/meetv/bibliotrack-api/routes/api/bookRouter'); 
const Books = require('routes/api/bookRouter.js'); 

const { expect } = chai;

chai.use(chaiHttp);

describe('Books API', () => {
  before((done) => {
    mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('open', () => {
      console.log('Connected to the test database');
      done();
    });
  });

  after((done) => {
    mongoose.connection.close(() => {
      console.log('Disconnected from the test database');
      done();
    });
  });

  describe('GET /books', () => {
    it('should return a list of books', (done) => {
      chai.request(app)
        .get('/books')
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /books/:bookId', () => {
    it('should return a single book by ID', (done) => {
      const newBook = new Books({ name: 'Test Book', author: 'Test Author' });
      newBook.save((_err, book) => {
        chai.request(app)
          .get(`/books/${book._id}`)
          .end((_err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('_id').equal(book._id.toString());
            done();
          });
      });
    });

    it('should return 404 for non-existent book ID', (done) => {
      chai.request(app)
        .get('/books/nonexistentid')
        .end((_err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe('POST /books', () => {
    it('should add a new book', (done) => {
      const newBook = { name: 'New Book', author: 'New Author' };
      chai.request(app)
        .post('/books')
        .send(newBook)
        .end((_err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name').equal(newBook.name);
          done();
        });
    });

    it('should return 401 for unauthorized user', (done) => {
      chai.request(app)
        .post('/books')
        .send({ name: 'Unauthorized Book', author: 'Unauthorized Author' })
        .end((_err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  describe('PUT /books/:bookId', () => {
    it('should update an existing book', (done) => {
      const updatedBookData = { name: 'Updated Book', author: 'Updated Author' };
      const newBook = new Books({ name: 'Original Book', author: 'Original Author' });

      newBook.save((_err, book) => {
        chai.request(app)
          .put(`/books/${book._id}`)
          .send(updatedBookData)
          .end((_err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name').equal(updatedBookData.name);
            done();
          });
      });
    });

    it('should return 404 for non-existent book ID', (done) => {
      chai.request(app)
        .put('/books/nonexistentid')
        .send({ name: 'Updated Book', author: 'Updated Author' })
        .end((_err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe('DELETE /books/:bookId', () => {
    it('should delete an existing book', (done) => {
      const newBook = new Books({ name: 'To Be Deleted', author: 'Delete Author' });

      newBook.save((_err, book) => {
        chai.request(app)
          .delete(`/books/${book._id}`)
          .end((_err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('_id').equal(book._id.toString());
            done();
          });
      });
    });

    it('should return 404 for non-existent book ID', (done) => {
      chai.request(app)
        .delete('/books/nonexistentid')
        .end((_err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
describe('PUT /books', () => {
    it('should return 403 for PUT operation on /books', (done) => {
      chai.request(app)
        .put('/books')
        .end((_err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
  });

  describe('DELETE /books', () => {
    it('should return 403 for DELETE operation on /books', (done) => {
      chai.request(app)
        .delete('/books')
        .end((_err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
  });


