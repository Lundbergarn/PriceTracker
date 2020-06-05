const router = require('express').Router();
const scrapers = require('../scrapers');
const mail = require('../mail');
let Search = require('../models/search.model');

router.route('/search').get(async (req, res) => {
  try {
    const searches = await Search.find({});
    res.status(200).send(searches);
  } catch (error) {
    res.status(500).send(err, { message: 'Bad request' })
  }
});

router.route('/search').post(async (req, res) => {
  const { url, targetPrice, email } = req.body;

  if (!url, !targetPrice, !email) {
    res.status(500).send({ message: "Missing data" });
    return;
  }

  let channelData = await scrapers.scrapePage(url, targetPrice);

  if (channelData === undefined) {
    res.status(500).send({ message: "Couldn't return any data on search." });
    return;
  }

  channelData.price = formatPrice(channelData.price);

  if (targetPrice >= channelData.price) {
    res.status(200).send({ message: "Price already achieved." });
  } else {
    const newSearch = new Search({ url, targetPrice, email });

    try {
      await newSearch.save();
      res.send(channelData);

    } catch (error) {
      res.status(400).send(error);
    }
  }
});

module.exports = router;

formatPrice = (price) => {
  let formatPrice = price.split('');

  formatPrice = formatPrice.filter(num => (parseInt(num) >= 0 || num === '.') ? true : false);

  return parseFloat(formatPrice.join(''));
}

scrapeWebPage = async (url, searchPrice, email, id) => {
  let channelData = await scrapers.scrapePage(url, searchPrice);

  const currentPrice = formatPrice(channelData.price);
  const productName = channelData.name;

  // Should be bigger than, less than for demo purpose
  if (searchPrice <= currentPrice) {
    console.log('Send mail to ', email);
    mail.sendMail(productName.trim(), currentPrice, searchPrice, email, url);

    try {
      const searches = await Search.findOneAndDelete({ _id: id });
      console.log('Removed ', id);

    } catch (error) {
      console.log(error)
      throw (error);
    }

  } else {
    console.log('Target price', searchPrice, ' was not matched for user ', email);
  }
}

// Set up interval 
startIntervalScrape = () => {
  setInterval(async () => {
    const searches = await Search.find({});

    for (let i = 0; i < searches.length; i++) {
      try {
        const { url, targetPrice, email, _id } = searches[i];
        console.log('Checking price for ', email, '- Target price ', targetPrice);

        await scrapeWebPage(url, targetPrice, email, _id);

      } catch (err) {
        console.log(err);
      }
    }
    // }, 43200000);
  }, 10000);
  // Shorter interval for demo purpose
}

startIntervalScrape();