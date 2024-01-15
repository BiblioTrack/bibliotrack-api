const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;

const Issue = require('../models/issues');
const BookRequest = require('../models/bookRequest'); // Import the BookRequest model

const mongoURI = require('../config/keys').mongoTestURI;

describe('Issue Model', () => {
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
    await Issue.deleteMany({});
    await BookRequest.deleteMany({}); // Clear book requests as well
  });

  it('should create a new issue', async () => {
    // Create a sample book request
    const bookRequest = new BookRequest({
      userId: new mongoose.Types.ObjectId(),
      bookId: new mongoose.Types.ObjectId(),
      copyNumber: 1,
      dueDate: new Date(),
      reason: 'Test reason',
    });

    const savedBookRequest = await bookRequest.save();

    const sampleIssue = {
      request: savedBookRequest._id, // Use the ID of the saved book request
      // Add more fields as needed for the test
    };

    const newIssue = new Issue(sampleIssue);
    const savedIssue = await newIssue.save();

    expect(savedIssue._id).to.exist;
    expect(savedIssue.request.toString()).to.equal(sampleIssue.request.toString());
    // Add more assertions for other fields as needed
  });

  it('should have default values for optional fields', async () => {
    // Create a sample book request
    const bookRequest = new BookRequest({
      userId: new mongoose.Types.ObjectId(),
      bookId: new mongoose.Types.ObjectId(),
      copyNumber: 1,
      dueDate: new Date(),
      reason: 'Test reason',
    });

    const savedBookRequest = await bookRequest.save();

    const sampleIssue = {
      request: savedBookRequest._id, // Use the ID of the saved book request
      // Add more fields as needed for the test
    };

    const newIssue = new Issue(sampleIssue);
    const savedIssue = await newIssue.save();

    expect(savedIssue._id).to.exist;
    expect(savedIssue.issueDate).to.exist;
    expect(savedIssue.issueDate).to.be.a('Date');
    // Add more assertions for other default values as needed
  });

  // Add more test cases based on your requirements
});
