const express = require('express');
const mongoose = require('mongoose');
const Books = require('./models/books'); 
const Users = require('./models/users');
const Requests = require('./models/request');
const Issues = require('./models/issues');   // Import your book model

// var Books = mongoose.model('Book', bookSchema);
// var Users = mongoose.model('User', UserSchema);
// var Requests = mongoose.model('Request', requestSchema);
// var Issues = mongoose.model('Issue', issueSchema);

 
const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect('mongodb+srv://bibliotrack:admin@ase23.ecc730x.mongodb.net/?retryWrites=true&w=majority/bibliotrack', 
{ useNewUrlParser: true, useUnifiedTopology: true });

// Define a custom API endpoint for mocking book data
app.get('/api/mock-books', async (req, res) => {
  try {
    // Fetch mock book data from the database 
    const mockBooks = await Books.find().limit(1); // Fetching 10 books as an example

    res.json(mockBooks);
  } catch (error) {
    console.error('Error fetching mock books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/mock-issues', async (req, res) => {
    try{
        //fetch mock issue data from the database 
        const mockIssues = await Issues.find().limit(10); 
        res.json(mockIssues);

    } catch (error) {
        console.error('error fetching mock issues:', error);
        res.status(500).json({ error: 'Internal server Error' });
    }
});

app.get('/api/mock-requests', async (req, res) => {
    try{
        //fetch mock requests data from the database 
        const mockRequests = await Requests.find().limit(10);
        res.json(mockRequests);

    } catch (error) {
        console.error('error fetching mock requests:', error);
        res.status(500).json({ error: 'Internal server Error' });
    }
});

app.get('/api/mock-users', async (req, res) => {
    try{
        //fetch mock requests data from the database 
        const mockUsers = await Users.find().limit(10); 
        res.json(mockUsers);

    } catch (error) {
        console.error('error fetching mock users:', error);
        res.status(500).json({ error: 'Internal server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// module.exports = Books;
// module.exports = Users;
// module.exports = Issues;
// module.exports = Requests;