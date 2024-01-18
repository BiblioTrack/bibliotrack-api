const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const request = require("supertest");
const sandbox = sinon.createSandbox();
const mongoose = require("mongoose");
const User = require("../models/users");

const mongoURI = require("../config/keys").mongoTestURI;

describe("Testing user routes", () => {
  let sampleUser;
  let savedUser;

  before(async () => {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
    app.close();
  });

  beforeEach(async () => {
    sampleUser = {
      firstname: "John",
      lastname: "Doe",
      username: "johndoe",
      email: "johndoe@example.com",
      role: "student",
      admin: false,
      password: "12345678",
    };

    app = require("../index");
  });

  afterEach(async () => {
    await User.deleteMany({});

    sandbox.restore();
  });

  describe("Testing user DB endpoints", () => {
    beforeEach(async () => {
      const user = new User(sampleUser);
      savedUser = await user.save();
    });

    it("GET / should return all users", async () => {
      const response = await request(app).get("/api/users").expect(200);

      expect(response.body[0])
        .to.have.property("_id")
        .equal(savedUser._id.toString());
    });

    it("PUT /userId should update a user by Id", async () => {
      let updatedData = {
        firstname: "updated",
      };

      const response = await request(app)
        .put(`/api/users/${savedUser._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body)
        .to.have.property("firstname")
        .equal(updatedData.firstname);
    });

    it("PUT /password/userId should update a user password by Id", async () => {
      let updatedData = {
        password: "updated",
      };

      const response = await request(app)
        .put(`/api/users/password/${savedUser._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body)
        .to.have.property("message")
        .equal("password changed successfully");
    });
  });

  describe("Testing user auth", () => {
    beforeEach(async () => {
      sandbox.stub(User, "findOne").resolves(null);
      await request(app).post("/api/users/signup").send(sampleUser).expect(200);
      sandbox.restore();
    });

    it("POST /signup should create a new user account", async () => {
      const registeredUser = await User.findOne({
        username: sampleUser.username,
      });
      expect(registeredUser).to.exist;
      expect(registeredUser.firstname).to.equal(sampleUser.firstname);
      expect(registeredUser.lastname).to.equal(sampleUser.lastname);
      expect(registeredUser.email).to.equal(sampleUser.email);
      expect(registeredUser.role).to.equal(sampleUser.role);
      expect(registeredUser.admin).to.equal(sampleUser.admin);
    });

    it("POST /login should log in a user and generate a JWT token for authentication", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send(sampleUser)
        .expect(200);

      expect(response.body)
        .to.have.property("status")
        .equal("Login Successful!");
    });

    it("GET /checkJWTtoken should check the validity of the JWT token for user authentication", async () => {
      let response = await request(app)
        .post("/api/users/login")
        .send(sampleUser)
        .expect(200);

      expect(response.body)
        .to.have.property("status")
        .equal("Login Successful!");

      response = await request(app)
        .get("/api/users/checkJWTtoken")
        .set("Authorization", `Bearer ${response.body.token}`)
        .expect(200);

      expect(response.body).to.have.property("status").equal("JWT valid!");
    });
  });
});
