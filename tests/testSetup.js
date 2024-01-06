const mongoose = require('mongoose');
const mongoURI = require('../config/keys').mongoTestURI;

before(async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  await mongoose.connection.close();
});
