const { startBrowser, createPage } = require("./puppeteerInit");
const {
  getCatData,
  scrapeCatPages,
  getProductData,
  filterCat,
} = require("./watsonsScraper");

const { jsonArrayToExcel } = require("./jsonToExcel");

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
      await filterCat(allprodCatData, "oxy"),
      await filterCat(allprodCatData, "hada labo"),
      await filterCat(allprodCatData, "abbott"),
      await filterCat(allprodCatData, "c.code"),
      await filterCat(allprodCatData, "l'oreal"),
      await filterCat(allprodCatData, "watsons"),
      await filterCat(allprodCatData, "neutrogena")
    );
    console.log(filteredCatData);

    let scrapedCatPageData = await scrapeCatPages(page, filteredCatData);

    // Writes into Excel File
    await jsonArrayToExcel(scrapedCatPageData, "watsons_data_5");
    console.log(`File is written: ${scrapedCatPageData.length} items scrapped`);

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

// //Start the browser and create a browser instance
// let browserInstance = startBrowser();

// // Pass the browser instance to the scraper controller
// scraperController(browserInstance);
