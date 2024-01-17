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

describe("Testing user routes", () => {
    let sampleUser;

    before(async () => {
        await mongoose.connect(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
    });

    after(async () => {
        await mongoose.connection.close();
        app.close();
    });

    beforeEach(async() => {
        sampleUser = {
            firstname: 'John',
            lastname: 'Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
            role: 'student',
            admin: true,
            password: '12345678',
        };

        app = require("../index");
    });

    afterEach(async () => {
        await User.deleteMany({});

        sandbox.restore();
    });

    it('POST /signup should create a new user account', async() => {
        sandbox.stub(User, 'findOne').resolves(null);

        await request(app)
            .post('/api/users/signup')
            .send(sampleUser)
            .expect(200);

            sandbox.restore();

            const registeredUser = await User.findOne({ username: sampleUser.username });
            expect(registeredUser).to.exist;
            expect(registeredUser.firstname).to.equal(sampleUser.firstname);
            expect(registeredUser.lastname).to.equal(sampleUser.lastname);
            expect(registeredUser.email).to.equal(sampleUser.email);
            expect(registeredUser.role).to.equal(sampleUser.role);
            expect(registeredUser.admin).to.equal(sampleUser.admin);
    })

    it('POST /login should log in a user and generate a JWT token for authentication', async() => {
        // const user = new User(sampleUser);
        // savedUser = await user.save();

        sandbox.stub(User, 'findOne').resolves(null);
        await request(app)
            .post('/api/users/signup')
            .send(sampleUser)
            .expect(200);
        sandbox.restore();

        const response = await request(app)
            .post('/api/users/login')
            .send(sampleUser)
            .expect(200);

        expect(response.body).to.have.property('status').equal('Login Successful!');
    })
});
