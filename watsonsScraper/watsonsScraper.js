const jsonToExcel = require("./jsonToExcel");

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
        waitUntil: "networkidle2",
        timeout: 0,
      });
      await page.waitForSelector(".product-container");

      let prodCatalogueData = await page.$$eval(
        ".productContainer",
        (prodCardsData) => {
          prodCardsData = prodCardsData.map((prodCard) => {
            let priceCurrent = prodCard
              .querySelector(".productPrice")
              .childNodes[0].nodeValue.trim();
            let priceOriginal =
              prodCard
                .querySelector(".productPrice")
                .childNodes[0].nodeValue.trim() || priceCurrent;
            let discount_pct = 1 - priceCurrent / priceOriginal;
            let discount_abs = priceOriginal - priceCurrent;

            return {
              name: prodCard.querySelector(".productName").innerText,
              image: prodCard
                .querySelector("e2-product-thumbnail > img")
                .getAttribute("src"),
              highlight: prodCard.querySelector(".productHighlight").innerText,
              priceCurrent: priceCurrent,
              priceOriginal: priceOriginal || priceCurrent,
              discounted: priceCurrent - priceOriginal == 0 ? true : false,
              discount_pct: discount_pct,
              discount_abs: discount_abs,
            };
          });
          return prodCardsData;
        }
      );

      scrapedCatPagesData = scrapedCatPagesData.concat(prodCatalogueData);
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
