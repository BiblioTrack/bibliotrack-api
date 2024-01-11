const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const today = new Date();


const bookSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '----Not available----'
    },

    isbn: {
        type: String,
        minlength: 10,
        maxlength: 13,
        required: true,
        unique: true
    },
    genres: {
        type: [String],
        enum: ['Romance','Technology','Computer Science','Management','Electronics','Physics','Chemistry','Mathematics','Fiction','Philosophy','Language','Arts','Other'],
        required: true
    },
    shelf: {
        type: Number,
        min: 1,
        max: 100,
        required: true
    },
    pages: {
        type: Number ,min:1 // Assuming pages is a number
    },
    floor: {
        type: Number, min: 0, max: 8
    }, 
    format: {
        type: String  // Assuming format is a string
    },
    copies: {
        type: Number,
        min: 1, max: 1000, required: true
    },
    editor: {
        type: String, required: true
    },
    publisher:{
        type:String,
    },
    publicationDate: {
        type: Date,  // Changed to Date type
        max: today,  // Set max date to the current date
        default: today  // Set default value to today's date
    },
    availableCopies: {
        type: Number, min: 0
    },
    totalCopies: {
        type: Number, min: 0  // Assuming totalCopies is a number
    },
    edition: {
        type: Number, min: 1, max: 1000
    },
    language: {
        type: String, enum: ['English', 'German','Turkish',  'Italian', 'French', 'Arabic', 'Persian', 'Greek', 'Spanish','Polish', 'Other', 'Unknown'],
        required: true
    }
}, {
    timestamps: true
});
var Books = mongoose.model('Book',bookSchema);

module.exports=Books;