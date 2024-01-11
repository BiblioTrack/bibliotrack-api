const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;

const Book = require('../models/books');

const mongoURI = require('../config/keys').mongoTestURI;

describe('Books Model', () => {
  // Establish database connection before running tests
  before(async () => {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true // Using the updated flag
    });
  });

  // Close database connection after running tests
  after(async () => {
    await mongoose.connection.close();
  });

  // Clear the database after each test
  afterEach(async () => {
    await Book.deleteMany({});
  });

  // Test for creating a new book with valid data
  it('should create a new book', async () => {
    const sampleBook = {
      name: 'Test Book',
      author: 'Test Author',
      description: 'Test description',
      isbn: '1234567890123',
      genres: ['Fiction'],
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

  // Test for not saving a book without required fields
  // Test for not saving a book without required fields
  // Test for not saving a book without required fields
  it('should not save a book without required fields', async () => {
    const incompleteBook = new Book({});

    try {
        await incompleteBook.save();
        throw new Error('Book saved without required fields');
    } catch (err) {
        // Log the entire error object for detailed information
        console.log(err);

        expect(err).to.be.an('Error');
        // Ensure that the error is a validation error
        expect(err.name).to.equal('ValidationError');
    }
});


  // Test for not saving a book with invalid ISBN length
  it('should not save a book with invalid ISBN length', async () => {
    const invalidISBNBook = new Book({
      name: 'Invalid ISBN Book',
      author: 'Test Author',
      isbn: '12345', // Invalid length
      genres: ['Fiction'],
      shelf: 5,
      copies: 1,
      publishYear: 2023,
      editor: 'Test Editor',
      language: 'English'
    });

    try {
      await invalidISBNBook.save();
      throw new Error('Book saved with invalid ISBN length');
    } catch (err) {
      expect(err).to.be.an('Error');
      expect(err.errors).to.exist;
      expect(err.errors.isbn).to.exist;
      expect(err.errors.isbn.kind).to.equal('minlength'); // Assert ISBN length validation error
    }
  });

});
