const chai = require('chai');
const expect = chai.expect;
const auth = require('../authenticate');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const request = require('supertest');
const sandbox = sinon.createSandbox();
const mongoose = require('mongoose');
const Issue = require('../models/issues');
const Book = require('../models/books');
const User = require('../models/users');

const mongoURI = require('../config/keys').mongoTestURI;

const jwt = require('jsonwebtoken');

describe('Testing issue routes', () => {

    before(async () => {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    beforeEach(() => {
        sandbox.stub(auth, 'verifyUser').callsFake((req, res, next) => next());

        app = require('../index');
    });

    after(async () => {
        await mongoose.connection.close();
        app.close()
    });

    afterEach(async() => {
        await Issue.deleteMany({});
        await User.deleteMany({});
        await Book.deleteMany({});

        sandbox.restore();
    });

    describe('/api/issues', () => {
        it('GET /issues should fetch all issues', async () => {
          const response = await request(app)
            .get('/api/issues')
            .expect(200);
    
        //   expect(response.body).to.be.an('array');
        });

        it('POST /issues should create a new issue', async () => {
            const sampleBook = {
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
            let savedBook = await book.save();

            const sampleUser = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'johndoe@example.com',
                roll: '12345',
                admin: false,
            };

            const user = new User(sampleUser);
            let savedUser = await user.save();

            const issueData = {
              userId: savedUser._id,
              bookId: savedBook._id,
              copyNumber: 1,
              dueDate: new Date()
            };
    
            const response = await request(app)
              .post('/api/issues')
              .send(issueData)
              .expect(200);

            // expect(response.body).to.be.an('object');
        });

        it('PUT /issues should fail', async() => {
            const response = await request(app)
                .put(`/api/issues`)
                .expect(403);
        });

        it('DELETE /issues should delete all issues', async() => {
            const userId = new mongoose.Types.ObjectId().toString();
            const bookId = new mongoose.Types.ObjectId().toString();

            const sampleIssue = {
            userId,
            bookId,
            copyNumber: 1,
            dueDate: new Date()
            };

            const newIssue = new Issue(sampleIssue);
            await newIssue.save();

            await request(app)
                .delete('/api/issues')
                .expect(200);

            const issuesInDb = await mongoose.model('Issue').find();
            expect(issuesInDb).to.have.lengthOf(0);
        })
    });

    describe('/api/issues/:issueId', () => {
        // it('GET /:issueId should fetch a specific issue by ID', async () => {
        //     const sampleBook = {
        //         name: 'Test Book',
        //         author: 'Test Author',
        //         description: 'Test description',
        //         isbn: '1234567890123',
        //         cat: 'Fiction',
        //         shelf: 5,
        //         copies: 1,
        //         publishYear: 2023,
        //         editor: 'Test Editor',
        //         language: 'English',
        //       };

        //     const book = new Book(sampleBook);
        //     let savedBook = await book.save();

        //     const sampleUser = {
        //         firstname: 'John',
        //         lastname: 'Doe',
        //         email: 'johndoe@example.com',
        //         roll: '12345',
        //         admin: false,
        //     };

        //     const user = new User(sampleUser);
        //     let savedUser = await user.save();

        //     const sampleIssue = {
        //         userId: savedUser._id,
        //         bookId: savedBook._id,
        //         copyNumber: 1,
        //         dueDate: new Date()
        //       };

        //     const newIssue = new Issue(sampleIssue);
        //     const savedIssue = await newIssue.save();

        //     console.log(auth.getToken(sampleUser));

        //     const response = await request(app)
        //         .get(`/api/issues/${savedIssue._id}`)
        //         .set('Authorization', `Bearer ${auth.getToken(sampleUser)}`)
        //         .expect(200);

        //     expect(response.body).to.have.property('_id').equal(savedIssue._id.toString());
        // })

        it('POST /:issueId should fail', async() => {
            await request(app)
                .post(`/api/issues/${1}`)
                .expect(403);
        })

        it('DELETE /:issueId should fail', async() => {
            await request(app)
                .delete(`/api/issues/${1}`)
                .expect(403);
        })
    });
});