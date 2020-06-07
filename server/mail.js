const nodemailer = require('nodemailer');
// const mailtrapAcc = require('./config/keys').Mailtrap;
// const mailtrapPw = require('./config/keys').MailtrapPassword;
const gmailAcc = require('./config/keys').GoogleMail;
const gmailPw = require('./config/keys').GooglePassword;

sendMail = (productName, price, searchPrice, email, url) => {
  // Mailtrap
  // const transport = nodemailer.createTransport({
  //   host: 'smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //     user: mailtrapAcc,
  //     pass: mailtrapPw
  //   }
  // });

  // Gmail
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailAcc,
      pass: gmailPw
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  const message = {
    from: gmailAcc,
    to: email,
    subject: 'Price tracker',
    html: `
      <h3>Your previous search has found a match!</h3>
      <p>${productName}</p>
      <p>Price: ${price} $</p>
      <p>Searched price: ${searchPrice} $</p>
      <span>${url}</span>
    `
  };

  transport.sendMail(message, function (err, info) {
    if (error) {
      console.error(error)
      throw (error)
    } else {
      console.log(info);
    }
  });
}

module.exports = {
  sendMail
};
