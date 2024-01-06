const mongoose = require('mongoose');
const { expect } = require('chai');
const Request = require('../models/request');
const User = require('../models/users'); // Assuming 'User' is your user model
const Book = require('../models/books'); // Assuming 'Book' is your book model

const mongoURI = require('../config/keys').mongoTestURI;

describe('Request Model', () => {
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
    await Request.deleteMany({});
  });

  it('should have the required properties in the schema', () => {
    const request = new Request();

    const {
      userId,
      bookId,
      issueDate,
      dueDate,
      status,
    } = request.schema.paths;

    expect(userId.instance.toLowerCase()).to.equal('objectid');
    expect(userId.options.ref).to.equal('User');
    expect(userId.options.required).to.equal(true);

    expect(bookId.instance.toLowerCase()).to.equal('objectid');
    expect(bookId.options.ref).to.equal('Book');
    expect(bookId.options.required).to.equal(true);

    expect(issueDate.instance.toLowerCase()).to.equal('date');
    expect(issueDate.options.default).to.equal(Date.now);

    expect(dueDate.instance.toLowerCase()).to.equal('date');
    expect(dueDate.options.required).to.equal(true);

    expect(status.instance.toLowerCase()).to.equal('string');
    expect(status.options.enum).to.deep.equal(['Pending', 'Rejected', 'Approved']);
    expect(status.options.default).to.equal('Pending');
  });
});
