const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;

const Book = require('../models/books');

const mongoURI = require('../config/keys').mongoTestURI;

describe('Books Model', () => {
  before(async () => {
      await mongoose.connect(mongoURI, {
          useNewUrlParser: true,
          // Remove useUnifiedTopology as it's deprecated
      });
  });

  after(async () => {
      await mongoose.connection.close();
  });

  afterEach(async () => {
      await Book.deleteMany({});
  });

  it('should create a new book', async () => {
      const sampleBook = {
          name: 'Test Book',
          author: 'Test Author',
          description: 'Test description',
          isbn: '1234567890',
          cat: 'Fiction',
          shelf: 5,
          copies: 1,
          publishYear: 2023,
          editor: 'Test Editor',
          language: 'English'
          // Add other fields as needed for the test
      };

      const newBook = new Book(sampleBook);
      const savedBook = await newBook.save();

      expect(savedBook._id).to.exist;
      expect(savedBook.name).to.equal('Test Book');
      // Add more assertions for other fields as needed
  });

  it('should not save a book without required fields', async () => {
      const incompleteBook = new Book({
          // Creating a book without required fields intentionally
          // This test should fail
      });

      try {
          await incompleteBook.save();
          throw new Error('Book saved without required fields');
      } catch (err) {
          expect(err).to.be.an('Error');
          expect(err.errors).to.exist;
          // Assert specific errors for missing required fields
      }
  });

  // Add more test cases based on your requirements
});
