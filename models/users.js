var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
        type: String,
          required: true,      
      },
    lastname: {
        type: String,
         required: true,     
      },
      username: {
        type: String,
        required: true,
        unique: true,
        // Add a custom error message for uniqueness violation
        uniqueCaseInsensitive: true,
        dropDups: true,
        validate: {
            validator: async function (value) {
                const existingUser = await this.constructor.findOne({ username: new RegExp(`^${value}$`, 'i') });
                return !existingUser;
            },
            message: 'The username is already taken.'
        }
      },
      email:{
          type: String,
          required: true,
          unique: true
      },
      role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        required: true
      },      
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);