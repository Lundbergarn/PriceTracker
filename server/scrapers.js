const puppeteer = require('puppeteer');

async function scrapeChannel(url, targetPrice) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x('/html/body/main/div/div[2]/div[2]/div[2]/section/div/section/div[1]/h1/span');
  const text = await el.getProperty('textContent');
  const name = await text.jsonValue();

  const [el2] = await page.$x('//*[@id="MainContent"]/div/div[2]/div[2]/div[2]/section/div/section/div[3]/div[3]/div[1]/div/div/div[1]/div[1]/div[1]/span');
  const text2 = await el2.getProperty('textContent');
  const price = await text2.jsonValue();

  browser.close();

  return { name, price, url, targetPrice }

}

module.exports = {
  scrapeChannel
}
