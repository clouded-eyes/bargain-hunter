const { jsonObjectToExcel, jsonArrayToExcel } = require("./jsonToExcel");

// // Get Product categoryData from Catalogue Page
// async function getCatData(page, productBrand) {
async function getCatData(page) {
  try {
    console.log(`Getting All Category Data...... `);

    // Get the link to all the required books
    await page.waitForSelector(".brand-search-list");
    // Get the link to all the required books
    let productCategoryDataAll = await page.$$eval(
      ".brand > a",
      (categoryData, productBrand) => {
        // Extract the categoryData from the data
        categoryData = categoryData.map((brand) => {
          // Strips Url to get Brand Codes
          let brandCode = brand.href.replace(
            /https\:\/\/www\.watsons\.com\.my\/all-brands\/b\//,
            ""
          );
          brandCode = brandCode.replace(/\/.*/g, "");

          return {
            name: brand.textContent.toLowerCase(),
            brandCode: brandCode,
            urlBrandPage: brand.href,
            urlAllProductPage: `https://www.watsons.com.my/Product-Categories/c/1?q=:productBrandCode:productBrandCode:${brandCode}&text=&masterBrandCode=${brandCode}&sortCode=bestSeller`,
          };
        });
        return categoryData;
      }
      // productBrand
    );
    return productCategoryDataAll;
  } catch (error) {
    console.log(`getCatData Error: ${error}`);
  }
}

// Filters To Only Specific Brands
function filterCat(productCategoryData, categoryName) {
  const brand = productCategoryData.filter((Cat) => {
    return Cat.name.includes(categoryName.toLowerCase());
  });
  return brand;
}

// Scrape Product Page Catalogue Page if Next Page Exist
async function scrapeCatPages(page, categoryData) {
  try {
    console.log(`Scraping Category Pages...... `);
    let scrapedCatPagesData = [];

    for (let category of categoryData) {
      await page.goto(category.urlAllProductPage, {
        waitUntil: "networkidle0",
        timeout: 0,
      });

      let nextButton = true;
      let nextButtonDisabled = false;

      while (nextButton && !nextButtonDisabled) {
        // Scrape Current Page in a Category Catalogue Page
        async function scrapeCurrentPage() {
          await page.waitForSelector(".product-container");

          let prodCatalogueData = await page.$$eval(
            ".productContainer",
            (prodCardsData) => {
              prodCardsData = prodCardsData.map((prodCard) => {
                // Get Attributes to Calculate/Process
                let priceCurrent = prodCard
                  .querySelector(".productPrice")
                  .childNodes[0].nodeValue.trim();
                let priceOriginal;
                try {
                  priceOriginal = prodCard.querySelector(
                    ".productPrice > .productOriginalPrice"
                  ).innerText;
                } catch (error) {
                  priceOriginal = priceCurrent;
                }

                let discount_pct = 1 - priceCurrent / priceOriginal || 0;
                let discount_abs = priceOriginal - priceCurrent || 0;

                return {
                  name: prodCard.querySelector(".productName").innerText,
                  link: prodCard.querySelector(".productName > a").href,
                  image: prodCard
                    .querySelector("e2-product-thumbnail > img")
                    .getAttribute("src"),
                  highlight:
                    prodCard.querySelector(".productHighlight").innerText ||
                    null,
                  priceCurrent: priceCurrent,
                  priceOriginal: priceOriginal || priceCurrent,
                  priceCurrency: "MYR",
                  discounted: priceCurrent - priceOriginal == 0 ? true : false,
                  discount_pct: discount_pct,
                  discount_abs: discount_abs,
                };
              });
              return prodCardsData;
            }
          );
          return prodCatalogueData;
        }

        let currentPageData = await scrapeCurrentPage();

        scrapedCatPagesData = scrapedCatPagesData.concat(currentPageData);

        try {
          nextButton = await page.$eval(
            "li.page-item > a.page-link > .icon-arrow-right",
            (a) => a.textContent
          );
          nextButton = true;
        } catch (error) {
          nextButton = false;
        }
        try {
          nextButtonDisabled = await page.$eval(
            "li.page-item.disabled > a.page-link > .icon-arrow-right",
            (a) => a.textContent
          );
          nextButtonDisabled = true;
        } catch (error) {
          nextButtonDisabled = false;
        }
      }

      return scrapedData;
    }
    return scrapedCatPagesData;
  } catch (error) {}
  console.log(`scrapeCatPages Error: ${error}`);
}

// Get Product Data from Product Page
async function getProductData(page) {}

module.exports = {
  getCatData,
  scrapeCatPages,
  getProductData,
  filterCat,
};
