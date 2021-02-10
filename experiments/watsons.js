const puppeteer = require("puppeteer");
var userAgent = require("user-agents");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// puppeteer.use(StealthPlugin());

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

    let propertyPageData = await page.$$eval("p.brand", (brands) => {
      let propertyPageData = [];

      for (let brand of brands) {
        brand = {
          name: brand.querySelectorAll("p.brand")[0].innerText,
          url: brand.querySelectorAll("p.brand > a")[0].href,
        };
        console.log(brand);
        propertyPageData.push(brand);
      }
      return propertyPageData;
    });
    console.log(propertyPageData);
    await browser.close();
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
}

scrapeCurrentPage("https://www.watsons.com.my/b/brandlist");
