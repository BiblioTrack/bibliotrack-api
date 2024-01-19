const chai = require("chai");
const expect = chai.expect;
const auth = require("../authenticate");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const request = require("supertest");
const sandbox = sinon.createSandbox();
const mongoose = require("mongoose");
const Book = require("../models/books");
const User = require("../models/users");
const BookRequest = require("../models/bookRequest");

const mongoURI = require("../config/keys").mongoTestURI;

describe("Testing request routes", () => {
  let sampleBook, sampleUser, sampleRequest;
  let savedBook, savedUser, savedRequest;

  before(async () => {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany({});
    await Book.deleteMany({});
    await BookRequest.deleteMany({});
  });

  beforeEach(async() => {
    sandbox.stub(Book, 'findOne');
    app = require("../index");

    sampleBook = {
      name: 'Test Book',
      author: 'Test Author',
      description: 'Test description',
      isbn: '1234567890123',
      cat: 'Fiction',
      shelf: 5,
      copies: 1,
      publishYear: 2023,
      editor: 'Test Editor',
      language: 'English',
    };

    const book = new Book(sampleBook);
    savedBook = await book.save();

    sampleUser = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'usernametest',
        email: 'johndoe@example.com',
        role: 'student',
    };

    const user = new User(sampleUser);
    savedUser = await user.save();

    sampleRequest = {
        userId: savedUser._id,
        bookId: savedBook._id,
        copyNumber: 1,
        dueDate: new Date(),
        reason: 'Test reason',
    }
    });

    after(async () => {
      await mongoose.connection.close();
      app.close();
    });

    afterEach(async () => {
      await User.deleteMany({});
      await Book.deleteMany({});
      await BookRequest.deleteMany({});

    sandbox.restore();
  });

  describe("/api/bookRequests", () => {
    it("GET /request should fetch all requests", async () => {
      const tmprequest = new BookRequest(sampleRequest);
      let savedRequest = await tmprequest.save();

      const response = await request(app).get("/api/bookRequests").expect(200);

      expect(response.body[0]).to.have.property("_id").equal(savedRequest._id.toString());
    });

    // it("POST /request should create a new request", async () => {
    //     const response = await request(app)
    //         .post("/api/bookRequests")
    //         .send(sampleRequest)
    //         .expect(200);
  
    //     expect(response.body).to.have.property("userId").equal(savedUser._id.toString());
    //     expect(response.body).to.have.property("bookId").equal(savedBook._id.toString());
    //   });
  });

  describe("/api/bookRequests/:requestId", () => {
    let savedRequest;

    beforeEach(async() => {
        const tmprequest = new BookRequest(sampleRequest);
        savedRequest = await tmprequest.save();
    })

    // it('GET /request/:requestId should fetch a specific request by ID', async() => {
    //     const response = await request(app)
    //         .get(`/api/bookRequests/${savedRequest._id}`)
    //         .expect(200);
  
    //     expect(response.body).to.have.property("_id").equal(savedRequest._id.toString());
    // })

    it('DELETE /request/:requestId should delete a specific request by ID', async() => {
        await request(app)
            .delete(`/api/bookRequests/${savedRequest._id}`)
            .expect(200);
        
        const requestsInDb = await mongoose.model('BookRequest').find();
        expect(requestsInDb).to.have.lengthOf(0);
    })
  });
});
