const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;

const Issue = require('../models/issues'); // Update the path to your issue model

const mongoURI = require('../config/keys').mongoTestURI; // Replace with your test database URI

describe('Issue Model', () => {
  before(async () => {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Issue.deleteMany({});
  });

  it('should create a new issue', async () => {
    const sampleIssue = {
      userId: mongoose.Types.ObjectId(),
      bookId: mongoose.Types.ObjectId(),
      copyNumber: 1,
      dueDate: new Date()
      // Add more fields as needed for the test
    };

    const newIssue = new Issue(sampleIssue);
    const savedIssue = await newIssue.save();

    expect(savedIssue._id).to.exist;
    expect(savedIssue.userId).to.eql(sampleIssue.userId);
    expect(savedIssue.bookId).to.eql(sampleIssue.bookId);
    // Add more assertions for other fields as needed
  });

  it('should not save an issue without required fields', async () => {
    const incompleteIssue = new Issue({});

    try {
      await incompleteIssue.save();
      throw new Error('Issue saved without required fields');
    } catch (err) {
      expect(err).to.be.an('Error');
      expect(err.errors).to.exist;
      expect(err.errors.userId).to.exist;
      expect(err.errors.bookId).to.exist;
      expect(err.errors.copyNumber).to.exist;
      expect(err.errors.dueDate).to.exist;
      // Assert specific errors for missing required fields
    }
  });

  it('should have default values for optional fields', async () => {
    const sampleIssue = {
      userId: mongoose.Types.ObjectId(),
      bookId: mongoose.Types.ObjectId(),
      copyNumber: 1,
      dueDate: new Date()
      // Add more fields as needed for the test
    };

    const newIssue = new Issue(sampleIssue);
    const savedIssue = await newIssue.save();

    expect(savedIssue._id).to.exist;
    expect(savedIssue.issueDate).to.exist;
    expect(savedIssue.issueDate).to.be.a('Date');
    expect(savedIssue.returnDate).to.be.null;
    expect(savedIssue.isReturned).to.equal(false);
    // Add more assertions for other default values as needed
  });

});
