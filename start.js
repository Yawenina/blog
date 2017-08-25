const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config({ path: './variables.env' });

// connect database and handle bad connection
mongoose.connect(process.env.DATABASE, {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// require our models
require('./models/User');
require('./models/Tag');
require('./models/Category');
require('./models/Article');

// start our app
const app = require('./app.js');

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
