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
const BookRequest = require('../models/bookRequest')

const mongoURI = require('../config/keys').mongoTestURI;

describe('Testing issue routes', () => {
    let sampleBook, sampleUser, sampleRequest, sampleIssue;
    let savedBook, savedUser, savedRequest;

    before(async () => {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await BookRequest.deleteMany({});
        await Issue.deleteMany({});
        await User.deleteMany({});
        await Book.deleteMany({});
    });

    beforeEach(async() => {
        sandbox.stub(Book, 'findOne');
        app = require('../index');

        await BookRequest.deleteMany({});
        await Issue.deleteMany({});
        await User.deleteMany({});
        await Book.deleteMany({});

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
            username: 'testusername',
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

        const bookRequest = new BookRequest(sampleRequest);
        savedRequest = await bookRequest.save();

        sampleIssue = {
            request: savedRequest._id,
        }
    });

    after(async () => {
        await mongoose.connection.close();
        app.close()
    });

    afterEach(async() => {
        await BookRequest.deleteMany({});
        await Issue.deleteMany({});
        await User.deleteMany({});
        await Book.deleteMany({});

        sandbox.restore();
    });

    describe('/api/issues', () => {
        it('GET /issues should fetch all issues', async () => {
            let issue = new Issue(sampleIssue);
            savedIssue = await issue.save();

          const response = await request(app)
            .get('/api/issues')
            .expect(200);
    
            expect(response.body[0]).to.have.property('_id').equal(savedIssue._id.toString());
        });

        it('POST /issues should create a new issue', async () => {
            const response = await request(app)
              .post('/api/issues')
              .send(sampleIssue)
              .expect(200);

            expect(response.body).to.have.property('request').equal(savedRequest._id.toString());
        });

        it('PUT /issues should fail', async() => {
            await request(app)
                .put(`/api/issues`)
                .expect(403);
        });

        it('DELETE /issues should delete all issues', async() => {
            const issue = new Issue(sampleIssue);
            await issue.save();

            await request(app)
                .delete('/api/issues')
                .expect(200);

            const issuesInDb = await mongoose.model('Issue').find();
            expect(issuesInDb).to.have.lengthOf(0);
        })
    });

    describe('/api/issues/:issueId', () => {
        it('POST /:issueId should fail', async() => {
            let issue = new Issue(sampleIssue);
            savedIssue = await issue.save();

            await request(app)
                .post(`/api/issues/${savedIssue._id}`)
                .expect(403);
        })

        it('DELETE /:issueId should fail', async() => {
            let issue = new Issue(sampleIssue);
            savedIssue = await issue.save();

            await request(app)
                .delete(`/api/issues/${savedIssue._id}`)
                .expect(200);

            const deletedIssue = await Issue.findById(savedIssue._id);
            expect(deletedIssue).to.be.null;
        })
    });
});