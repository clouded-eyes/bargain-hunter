const puppeteer = require("puppeteer");
var userAgent = require("user-agents");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const websites = [
  {
    name: "Property Guru",
    property: "Reflection Residence",
    url:
      "https://www.propertyguru.com.my/property-for-sale?autocomplete=%7B%22objectId%22%3A%224511%22%2C%22objectType%22%3A%22PROPERTY%22%2C%22properties%22%3A%7B%22propertyTypeGroup%22%3A%22CONDO%22%7D%7D&property_id=4511&freetext=&sort=price&order=asc",
  },
  {
    name: "Property Guru",
    property: "Seapark",
    url:
      "https://www.propertyguru.com.my/property-for-sale?freetext=seapark&_freetextDisplay=seapark&sort=price&order=asc",
  },
];

async function scrapeCurrentPage(websiteURL) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.setUserAgent(userAgent.toString());

    await page.goto(websiteURL, { waitUntil: "networkidle0" });
    let propertyData = [];

    let nextButtonActive = true;

    while (nextButtonActive) {
      let propertyPageData = await page.$$eval(".listing-card", (cards) => {
        let propertyPageData = [];
        let todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, "-");

        for (let card of cards) {
          propertyCardData = {
            Id: card.getAttribute("data-listing-id"),
            Name: card.querySelector("h3 > a").innerText,
            Location: card.querySelector(".listing-location").innerText,
            Link: card.querySelector("a").href,
            Price: card.querySelector(".list-price").innerText,
            Listing_Recency: card.querySelector(".listing-recency").innerText,
            Date_Scrapped: todayDate,
          };
          propertyPageData.push(propertyCardData);
        }
        return propertyPageData;
      });

      nextButtonActive = await page.$(".pagination-next > a");
      await page.waitFor(10000);
      await page.click(".pagination-next > a");
    }

    let propertyDataAll = propertyDataAll.concat(propertyData);

    console.log(propertyPageData);
    console.log(propertyPageData.length);
    await browser.close();
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
}

scrapeCurrentPage(websites[1].url);
