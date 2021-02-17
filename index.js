const { startBrowser, createPage } = require("./watsonsScraper/puppeteerInit");
const {
  getCatData,
  scrapeCatPages,
  getProductData,
  filterCat,
} = require("./watsonsScraper/watsonsScraper");
const scraperController = require("./watsonsScraper/pageController");

// Initiate Constants
const websites = [
  { name: "watsons", url: "https://www.watsons.com.my/b/brandlist" },
  //   { name: "guardian", url: "https://guardian.com.my/index.php/pbrand.html" },
  //   { name: "zalora", url: "https://www.zalora.com.my/" },
  //   { name: "jdsports", url: "https://www.jdsports.my/" },
  //   { name: "shopee", url: "https://shopee.com.my/" },
  //   { name: "lazada", url: "https://www.lazada.com.my/" },
  //   { name: "hermo", url: "https://www.hermo.my/" },
  //   { name: "nike", url: "https://www.nike.com/my/" },
  //   { name: "addidas", url: "https://www.adidas.com.my/en" },
  //   { name: "sportsdirect", url: "https://my.sportsdirect.com/" },
  //   { name: "decathlon", url: "https://www.decathlon.my/" },
  //   {
  //     name: "propertyGuru",
  //     url:
  //       "https://www.propertyguru.com.my/property-for-sale?freetext=seapark&_freetextDisplay=seapark&sort=price&order=asc",
  //   },
  //   { name: "booksToScrape", url: "http://books.toscrape.com" },
];

for (const site of websites) {
  getVisual(site.url, site.name);
}

async function getVisual(siteURL, siteName) {
  try {
    // Start Browser
    const browser = await startBrowser();

    // Create New Page Stealth Page
    const page = await createPage(browser, siteURL);

    // Get All Category Data
    allprodCatData = await getCatData(page);

    // Filter to Specified Categories into Single Arr with Objs
    let prodCatData = [];
    let filteredCatData = prodCatData.concat(
      // await filterCat(allprodCatData, "watsons"),
      // await filterCat(allprodCatData, "hada labo"),
      await filterCat(allprodCatData, "neutrogena")
    );
    console.log(filteredCatData);

    let scrapedCatPageData = await scrapeCatPages(page, filteredCatData);
    console.log(scrapedCatPageData);

    // Scrapes all filtered Category

    // await scrapeCategoryPages(page, abbottData);
    // let urls = await page.$$eval(".brand", (links) => {
    //   // // Make sure the book to be scraped is in stock
    //   // links = links.filter(
    //   //   (link) =>
    //   //     link.querySelector(".instock.availability > i").textContent !==
    //   //     "In stock"
    //   // );

    //   // Extract the links from the data
    //   links = links.map((el) => el.querySelector("a").href);
    //   return links;
    // });

    // await page.screenshot({
    //   path: `../screenshots/${siteName}.png`,
    //   fullPage: true,
    // });
    // await page.pdf({ path: "page.pdf" });
    // console.log(`Screenshot Made - ${siteName}`);

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

// //Start the browser and create a browser instance
// let browserInstance = startBrowser();

// // Pass the browser instance to the scraper controller
// scraperController(browserInstance);
