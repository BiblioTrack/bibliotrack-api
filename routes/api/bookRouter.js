/**
 * bookRouter.js
 * Routes for managing books in the library system.
 */

// GET /books: Fetches all books (accessible by admin).
// POST /books: Creates a new book (accessible by authenticated users).
// PUT /books: Updates all books (not supported, returns 403 Forbidden).
// DELETE /books: Deletes all books (not supported, returns 403 Forbidden).

// GET /books/:bookId: Fetches a specific book by ID (accessible by all users).
// POST /books/:bookId: Creates a new book with a specific ID (not supported, returns 403 Forbidden).
// PUT /books/:bookId: Updates a specific book by ID (accessible by authenticated users).
// DELETE /books/:bookId: Deletes a specific book by ID (accessible by admin).

const express = require('express');
const bodyParser = require('body-parser');
const bookRouter = express.Router();
const authenticate = require('../../authenticate');
const cors = require('cors');
const Books = require('../../models/books');

bookRouter.use(bodyParser.json());
bookRouter.options('*', cors(), (req, res) => { res.sendStatus(200); });

bookRouter.route('/')
  .get(cors(), (req, res, next) => {
    Books.find(req.query)
      .sort({ name: 'asc' })
      .then((books) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(books);
      })
      .catch((err) => next(err));
  })
  .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.create(req.body)
      .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
      })
      .catch((err) => next(err));
  })
  .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /books');
  })
  .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /books');
  });

bookRouter.route('/:bookId')
  .options(cors(), (req, res) => { res.sendStatus(200); })
  .get(cors(), (req, res, next) => {
    Books.findById(req.params.bookId)
      .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
      })
      .catch((err) => next(err));
  })
  .post(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.create(req.body)
      .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
      })
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          res.status(400).json({
            success: false,
            error: "A book with the same name or ISBN already exists. Please choose a different name or ISBN."
          });
        } else {
          next(err);
        }
      });
  })
  .put(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.findByIdAndUpdate(req.params.bookId, { $set: req.body }, { new: true })
      .then((book) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
      })
      .catch((err) => {
        console.log('edit book', res);
        next(err)
      });
  })
  .delete(cors(), authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.findOneAndDelete({ _id: req.params.bookId })
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ _id: req.params.bookId, success: true });
      })
      .catch((err) => next(err));
  });

module.exports = bookRouter;