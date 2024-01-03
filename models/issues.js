const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const issueSchema = new Schema({
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
        type: Number, // Assuming copy number is a numerical value
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    },
    isReturned: {
        type: Boolean,
        default: false
    }
});


var Issues = mongoose.model('Issue',issueSchema);

module.exports=Issues;