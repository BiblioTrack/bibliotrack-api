const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;

const User = require('../models/users');

const mongoURI = require('../config/keys').mongoTestURI;

describe('User Model', () => {
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
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const sampleUser = {
      firstname: 'John',
      lastname: 'Doe',
      username: 'joedan',
      email: 'johndoe@example.com',
      role: 'student', // Assuming 'role' is the correct field name
      admin: false,
      // Add more fields as needed for the test
    };

    const newUser = new User(sampleUser);
    const savedUser = await newUser.save();

    expect(savedUser._id).to.exist;
    expect(savedUser.firstname).to.equal('John');
    expect(savedUser.lastname).to.equal('Doe');
    expect(savedUser.email).to.equal('johndoe@example.com');
    expect(savedUser.role).to.equal('student');
    expect(savedUser.admin).to.equal(false);
    // Add more assertions for other fields as needed
  });

  it('should not save a user without required fields', async () => {
    const incompleteUser = new User({});

    try {
      await incompleteUser.save();
      throw new Error('User saved without required fields');
    } catch (err) {
      expect(err).to.be.an('Error');
      expect(err.errors).to.exist;
      expect(err.errors.firstname).to.exist;
      expect(err.errors.lastname).to.exist;
      expect(err.errors.username).to.exist;
      expect(err.errors.email).to.exist;
      expect(err.errors.role).to.exist;
      // Assert specific errors for missing required fields
    }
  });

  // Add more test cases based on your requirements
});
