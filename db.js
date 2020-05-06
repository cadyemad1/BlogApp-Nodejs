const mongoose = require('mongoose');
const { mongoUrl } = require('./config');
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('connected to mongo');
  })
  .catch(err => {
    console.log('ERROR', err);
    process.exit(1);
  });
