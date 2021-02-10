const url = "https://www.watsons.com.my/all-brands/b/155173/daeng-gi-meo-ri";
const urlExample =
  "https://www.watsons.com.my/Product-Categories/c/1?q=:productBrandCode:productBrandCode:159126&text=&masterBrandCode=159126&sortCode=bestSeller";

const { startBrowser, createPage } = require("./puppetInit");
const { getPageLinks, paginate, getProductData } = require("./watsonsScraper");
const scraperController = require("./pageController");

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

    // Create New Page
    const page = await createPage(browser, siteURL);

    let productCategoryLinks = await getPageLinks(page);

    console.log(productCategoryLinks);
    console.log(productCategoryLinks.length);
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

    // await browser.close();
  } catch (error) {
    console.error(error);
  }
}

// //Start the browser and create a browser instance
// let browserInstance = startBrowser();

// // Pass the browser instance to the scraper controller
// scraperController(browserInstance);
