// const axios = require("axios");
// const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
var userAgent = require("user-agents");

// const express = require("express");
// const path = require("path");
// const ejsMate = require("ejs-mate");

// const app = express();

// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// const http = require("http");
// const PORT = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("Hello World");
// });

// server.listen(port, () => {
//   console.log(`Server running at PORT:${port}/`);
// });

//
const websites = [
  { name: "zalora", url: "https://www.zalora.com.my/" },
  { name: "jdsports", url: "https://www.jdsports.my/" },
  { name: "shopee", url: "https://shopee.com.my/" },
  { name: "lazada", url: "https://www.lazada.com.my/" },
  { name: "hermo", url: "https://www.hermo.my/" },
  { name: "nike", url: "https://www.nike.com/my/" },
  { name: "addidas", url: "https://www.adidas.com.my/en" },
  { name: "sportsdirect", url: "https://my.sportsdirect.com/" },
  { name: "decathlon", url: "https://www.decathlon.my/" },
];

const URL_List = {
  Watson: "https://www.watsons.com.my/b/brandlist",
  Guardian: "https://guardian.com.my/index.php/pbrand.html",
  Lazada:
    "https://www.lazada.com.my/my-mentholatum-official-store/?from=wangpu&lang=en&q=All-Products",
  Shopee: "https://shopee.com.my/shop/28285874/search",
};

const URLs = {
  HadaLabo:
    "https://www.watsons.com.my/Skinlcare/c/120000?sortCode=bestSeller&text=:bestSeller:category:120000:masterBrandName:HADA%20LABO",
  Brickz:
    "https://www.brickz.my/transactions/residential/selangor/petaling-jaya/seksyen-21/landed/terrace-house/",
  PropertyGuru: {
    ReflectionResidence:
      "https://www.propertyguru.com.my/property-for-sale?autocomplete=%7B%22objectId%22%3A%224511%22%2C%22objectType%22%3A%22PROPERTY%22%2C%22properties%22%3A%7B%22propertyTypeGroup%22%3A%22CONDO%22%7D%7D&property_id=4511&freetext=&sort=price&order=asc",
    Seapark:
      "https://www.propertyguru.com.my/property-for-sale?freetext=seapark&_freetextDisplay=seapark&sort=price&order=asc",
  },
  YCombinator: "https://news.ycombinator.com/",
};

for (const site of websites) {
  getVisual(site.url, site.name);
}

async function getVisual(siteURL, siteName) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.setUserAgent(userAgent.toString());
    await page.goto(siteURL, { waitUntil: "networkidle0" });
    await page.screenshot({
      path: `../screenshots/${siteName}.png`,
      fullPage: true,
    });
    await page.pdf({ path: "page.pdf" });
    console.log(`Screenshot Made - ${siteName}`);
    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

// async function scrapeCurrentPage(URL) {
//   try {
//     const browser = await puppeteer.launch({
//       headless: false,
//       args: ["--disable-setuid-sandbox"],
//       ignoreHTTPSErrors: true,
//     });
//     const page = await browser.newPage();

//     await page.setUserAgent(userAgent.toString());
//     await page.goto(URL, { waitUntil: "networkidle0" });
//     let propertyData = await page.$$eval(".listing-card", (cards) => {
//       let propertyData = [];
//       var todayDate = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
//       for (const card of cards) {
//         propertyCardData = {
//           propertyId: card.getAttribute("data-listing-id"),
//           propertyName: card.querySelector("h3 > a").innerText,
//           propertyLocation: card.querySelector(".listing-location").innerText,
//           propertyLink: card.querySelector("a").href,
//           propertyPrice: card.querySelector(".list-price").innerText,
//           propertyListingRecency: card.querySelector(".listing-recency")
//             .innerText,
//           propertyDateScrapped: todayDate,
//         };
//         propertyData.push(propertyCardData);
//       }
//       // console.log(card);
//       // card = card.map((el) => el.querySelector(".list-price").innerText);
//       // console.log(card);

//       return propertyData;
//     });

//     console.log(propertyData);
//     await browser.close();
//   } catch (error) {
//     console.error(error);
//   }
// }

// scrapeCurrentPage(URLs.PropertyGuru.Seapark);

// const getPostTitles = async () => {
//   try {
//     // const data = await axios.get(URL);

//     const { data } = await axios({
//       method: "get",
//       url: URLs.Brickz,
//       headers: {
//         "User-Agent":
//           userAgent.toString(),
//       },
//     });

//     const $ = cheerio.load(data);
//     // console.log(data);

//     const postTitles = [];

//     $(".list-price pull-left").each((_idx, el) => {
//       console.log(el);
//       const postTitle = $(el).text();
//       postTitles.push(postTitle);
//     });

//     return postTitles;
//   } catch (error) {
//     throw error;
//   }
// // };

// // getPostTitles().then((postTitles) => console.log(postTitles));

// // ROUTES
// app.get("/", (req, res) => {
//   // res.render("home");
//   res.send("HELLO WORLD!");
// });

// //OPEN PORT
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`EXPRESS LISTING ON PORT ${port}`);
// });
