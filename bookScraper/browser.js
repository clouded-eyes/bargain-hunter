const puppeteer = require("puppeteer");

// module.exports.startBrowser = async (params) => {
//   let browser;
//   try {
//     console.log("Opening the browser......");
//     browser = await puppeteer.launch({
//       headless: false,
//       args: ["--disable-setuid-sandbox"],
//       ignoreHTTPSErrors: true,
//     });
//   } catch (err) {
//     console.log("Could not create a browser instance => : ", err);
//   }
//   return browser;
// };

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

module.exports = startBrowser;
