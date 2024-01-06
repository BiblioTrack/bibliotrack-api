const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;

const Issue = require('../models/issues'); // Update the path to your issue model

const mongoURI = require('../config/keys').mongoTestURI; // Replace with your test database URI

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
  });

  it('should create a new issue', async () => {
    const userId = new mongoose.Types.ObjectId().toString(); // Use 'new' when generating ObjectId and convert to string
    const bookId = new mongoose.Types.ObjectId().toString(); // Use 'new' when generating ObjectId and convert to string

    const sampleIssue = {
      userId,
      bookId,
      copyNumber: 1,
      dueDate: new Date()
      // Add more fields as needed for the test
    };

    const newIssue = new Issue(sampleIssue);
    const savedIssue = await newIssue.save();

    expect(savedIssue._id).to.exist;
    expect(savedIssue.userId.toString()).to.equal(userId);
    expect(savedIssue.bookId.toString()).to.equal(bookId);
    // Add more assertions for other fields as needed
  });

  it('should have default values for optional fields', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const bookId = new mongoose.Types.ObjectId().toString();
  
    const sampleIssue = {
      userId,
      bookId,
      copyNumber: 1,
      dueDate: new Date()
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
