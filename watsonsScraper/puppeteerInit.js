//Enable stealth mode
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
// Random UserAgent
const randomUseragent = require("random-useragent");
var userAgent = require("user-agents");

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36";

// Function to Initiate Browser
async function startBrowser() {
  let browser;
  try {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
  return browser;
}

// Function to Create Page & Go to URL
async function createPage(browser, url) {
  let page;
  try {
    console.log("Opening a new page......");
    //Randomize User agent or Set a valid one
    // const userAgent = randomUseragent.getRandom();
    const UA = userAgent.toString() || USER_AGENT;
    const page = await browser.newPage();

    // Randomize viewport size
    await page.setViewport({
      // width: 1920 + Math.floor(Math.random() * 100),
      // height: 3000 + Math.floor(Math.random() * 100),
      width: 1920,
      height: 1200,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });

    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);

    // // Skip images/styles/fonts loading for performance
    // await page.setRequestInterception(true);
    // page.on("request", (req) => {
    //   if (
    //     req.resourceType() == "stylesheet" ||
    //     req.resourceType() == "font" ||
    //     req.resourceType() == "image"
    //   ) {
    //     req.abort();
    //   } else {
    //     req.continue();
    //   }
    // });

    await page.evaluateOnNewDocument(() => {
      // Pass webdriver check
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Pass chrome check
      window.chrome = {
        runtime: {},
        // etc.
      };
    });

    await page.evaluateOnNewDocument(() => {
      //Pass notifications check
      const originalQuery = window.navigator.permissions.query;
      return (window.navigator.permissions.query = (parameters) =>
        parameters.name === "notifications"
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters));
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, "plugins", {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5],
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `languages` property to use a custom getter.
      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });
    });

    await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });
    console.log("New Page Created......");
    return page;
  } catch (error) {
    console.log("Could not create a page instance => : ", error);
  }
}

module.exports = { startBrowser, createPage };
