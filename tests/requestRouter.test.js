const chai = require("chai");
const expect = chai.expect;
const auth = require("../authenticate");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const request = require("supertest");
const sandbox = sinon.createSandbox();
const mongoose = require("mongoose");
const Issue = require("../models/issues");
const Book = require("../models/books");
const User = require("../models/users");
const Request = require("../models/request");

const mongoURI = require("../config/keys").mongoTestURI;

describe("Testing issue routes", () => {
  before(async () => {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(() => {
    app = require("../index");
  });

  after(async () => {
    await mongoose.connection.close();
    app.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Book.deleteMany({});
    await Request.deleteMany({});

    sandbox.restore();
  });

  describe("/api/requests", () => {
    let sampleBook, sampleUser, sampleRequest;
    let savedBook, savedUser, savedRequest;


    beforeEach(async() => {
        sampleBook = {
            name: "Test Book",
            author: "Test Author",
            description: "Test description",
            isbn: "1234567890123",
            cat: "Fiction",
            shelf: 5,
            copies: 1,
            publishYear: 2023,
            editor: "Test Editor",
            language: "English",
          };
    
          const book = new Book(sampleBook);
          savedBook = await book.save();
    
          sampleUser = {
            firstname: "John",
            lastname: "Doe",
            email: "johndoe@example.com",
            roll: "12345",
            admin: false,
          };
    
          const user = new User(sampleUser);
          savedUser = await user.save();
    
          sampleRequest = {
            userId: savedUser._id,
            bookId: savedBook._id,
            dueDate: new Date(),
          };
    })

    it("GET /requests should fetch all requests", async () => {
      const tmprequest = new Request(sampleRequest);
      let savedRequest = await tmprequest.save();

      const response = await request(app).get("/api/request").expect(200);

      expect(response.body[0]).to.have.property("_id").equal(savedRequest._id.toString());
    });

    it("POST /requests should create a new request", async () => {
        const response = await request(app)
            .post("/api/request")
            .send(sampleRequest)
            .expect(200);
  
        expect(response.body).to.have.property("userId").equal(savedUser._id.toString());
        expect(response.body).to.have.property("bookId").equal(savedBook._id.toString());
      });

  });
});
