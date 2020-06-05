const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const searchRouter = require('./routes/search');

app.use(express.json());
app.use(cors());

app.use(searchRouter);

app.use(express.static('../client'));

const port = process.env.PORT || 3000;

const db = require('./config/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database');
  } else {
    console.log('Connected to Mongoose');
  }
});

app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
