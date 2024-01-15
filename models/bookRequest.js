// Issue request
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookRequestSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    copyNumber: {
        type: Number,
        required: true
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
});

var BookRequest = mongoose.model('BookRequest', bookRequestSchema);
module.exports = BookRequest;
