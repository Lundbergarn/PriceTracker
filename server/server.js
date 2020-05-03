const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const searchRouter = require('./routes/search');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use(searchRouter);

app.use(express.static('../client'));

const port = process.env.PORT || 3000;

// DB Config
const db = require('./config/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database');
  } else {
    console.log('Connected to Mongoose');
  }
});

app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



// if (+channelData.searchPrice >= formatPrice) {
//   console.log('match')
//   sendMail(channelData.name, channelData.price);
// } else {
//   // Add to database
// }




sendMail = (productName, price, URL) => {
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "50876d3d8cf313",
      pass: "cd5e514ae7479d"
    }
  });

  const message = {
    from: 'pricetrack@gmail.com', // Sender address
    to: 'to@email.com',         // List of recipients
    subject: 'Price tracker', // Subject line
    text: `${productName} finns nu tillgänglig till ${price} på ${URL}.`
  };

  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
}

// Posta en sökning
// Lägga till mailadress i sökning
// Gör en första sökning om det fanns en match
// Finns ingen match lägg till i databas för kommande sökningar
// Kör en sökning genom alla med intervall
// Finns en match - skicka mail och ta bort ur listan
