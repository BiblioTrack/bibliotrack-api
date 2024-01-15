const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    // Reference to BookRequest
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookRequest',
        required: true
    },
    // Include necessary fields from BookRequest
    issueDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date
    },
    isReturned: {
        type: Boolean,
        default: false
    }
});

var Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;
