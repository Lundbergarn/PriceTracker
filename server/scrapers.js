const puppeteer = require('puppeteer');

scrapePage = async (url, targetPrice) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('//*[@id="productTitle"]');
    const text = await el.getProperty('textContent');
    const name = await text.jsonValue();

    const [el2] = await page.$x('//*[@id="priceblock_ourprice"]');
    const text2 = await el2.getProperty('textContent');
    const price = await text2.jsonValue();

    browser.close();

    return { name, price, url, targetPrice };

  } catch (error) {
    throw error(error);
  }
}

module.exports = {
  scrapePage
}
