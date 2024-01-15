const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;

const BookRequest = require('../models/bookRequest');

const mongoURI = require('../config/keys').mongoTestURI;

describe('BookRequest Model', () => {
  before(async () => {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await BookRequest.deleteMany({});
  });

  it('should create a new book request', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const bookId = new mongoose.Types.ObjectId().toString();

    const sampleBookRequest = {
      userId,
      bookId,
      copyNumber: 1,
      dueDate: new Date(),
      reason: 'Test reason',
      // Add more fields as needed for the test
    };

    const newBookRequest = new BookRequest(sampleBookRequest);
    const savedBookRequest = await newBookRequest.save();

    expect(savedBookRequest._id).to.exist;
    expect(savedBookRequest.userId.toString()).to.equal(userId);
    expect(savedBookRequest.bookId.toString()).to.equal(bookId);
    // Add more assertions for other fields as needed
  });

  it('should have default values for optional fields', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const bookId = new mongoose.Types.ObjectId().toString();

    const sampleBookRequest = {
      userId,
      bookId,
      copyNumber: 1,
      dueDate: new Date(),
      reason: 'Test reason',
      // Add more fields as needed for the test
    };

    const newBookRequest = new BookRequest(sampleBookRequest);
    const savedBookRequest = await newBookRequest.save();

    expect(savedBookRequest._id).to.exist;
    expect(savedBookRequest.requestDate).to.exist;
    expect(savedBookRequest.requestDate).to.be.a('Date');
    // Add more assertions for other default values as needed
  });

  // Add more test cases based on your requirements
});
