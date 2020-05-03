const router = require('express').Router();
const scrapers = require('../scrapers');
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
  console.log('started scrape')
  const { url, targetPrice, email } = req.body;

  let channelData = await scrapers.scrapeChannel(url, targetPrice)

  channelData.price = formatPriceNumber(channelData.price);

  if (+targetPrice >= channelData.price) {
    res.status(200).send({ message: "Price already achieved" });
  } else {
    const newSearch = new Search({ url, targetPrice, email });
    try {
      await newSearch.save();
      console.log('saved')
      res.send(channelData);
    } catch (error) {
      console.log(error)
      res.status(400).send(error);
    }
  }
});

module.exports = router;

// Format numbers 
formatPriceNumber = (price) => {
  let formatPrice = price.split('');

  formatPrice = formatPrice.filter(el => {
    return parseInt(el) >= 0;
  });

  return formatPrice.join('');
}

// Set up interval 
intervalSearch = () => {
  setInterval(async () => {
    const searches = await Search.find({});

    searches.forEach(async (s) => {
      console.log('Checking price for ', s.email);
      await searchWeb(s.url, s.targetPrice, s.email, s._id);
    })
  }, 43200000);
}


// Use in time loop with database data 
searchWeb = async (url, searchPrice, email, id) => {
  let channelData = await scrapers.scrapeChannel(url, searchPrice)

  const formatPrice = formatPriceNumber(channelData.price);

  if (searchPrice >= formatPrice) {
    console.log('Target price ', searchPrice, ' reached for user ', email)
    // sendMail(channelData.name, channelData.price, URL);
    // Remove from database 
    try {
      const searches = await Kvitto.findOneAndDelete({ _id: id });
      console.log('Removed ', id);
    } catch (error) {
      console.log(error)
    }

  } else {
    console.log('Target price', searchPrice, ' was not matched for user ', email);
  }
}

intervalSearch();