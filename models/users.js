var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    firstname: {
        type: String,
          required: true,      
      },
    lastname: {
        type: String,
         required: true,     
      },
      email:{
          type: String,
          required: true,
          unique: true
      },
      roll:{
        type: String,
        required: true,
        unique: true
      },
    admin:   {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', User);