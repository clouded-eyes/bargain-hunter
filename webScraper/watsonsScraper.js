const { jsonArrayToExcel } = require("./jsonToExcel");

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
          let id = brand.href.replace(
            /https\:\/\/www\.watsons\.com\.my\/all-brands\/b\//,
            ""
          );
          id = id.replace(/\/.*/g, "");

          return {
            name: brand.textContent.toLowerCase(),
            id: id,
            urlBrandPage: brand.href,
            urlAllProductPage: `https://www.watsons.com.my/Product-Categories/c/1?q=:productBrandCode:productBrandCode:${id}&text=&masterBrandCode=${id}&sortCode=bestSeller&pageSize=1000`,
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

      // Function Scrape Current Page in a Category Catalogue Page
      async function scrapeCurrentPage() {
        await page.waitForSelector(".product-container");

        let prodCatalogueData = await page.$$eval(
          ".productContainer",
          (prodCardsData, category) => {
            prodCardsData = prodCardsData.map((prodCard) => {
              // Get Attributes to Calculate/Process
              let priceCurrent = prodCard
                .querySelector(".productPrice")
                .childNodes[0].nodeValue.trim()
                .replace(/RM/g, "");
              let priceOriginal;
              try {
                priceOriginal = prodCard
                  .querySelector(".productPrice > .productOriginalPrice")
                  .innerText.replace(/RM/g, "");
              } catch (error) {
                priceOriginal = priceCurrent;
              }

              let discount_pct = 1 - priceCurrent / priceOriginal || 0;
              let discount_abs = priceOriginal - priceCurrent || 0;
              let link = prodCard.querySelector(".productName > a").href;
              let id = link.replace(/.*p\//g, "");

              // Return Objects
              return {
                id,
                name: prodCard.querySelector(".productName").innerText,
                link,
                image: prodCard
                  .querySelector("e2-product-thumbnail > img")
                  .getAttribute("src"),
                highlight:
                  prodCard.querySelector(".productHighlight").innerText || null,
                priceCurrency: "MYR",
                priceCurrent: priceCurrent,
                priceOriginal: priceOriginal || priceCurrent,
                discounted: priceCurrent - priceOriginal == 0 ? false : true,
                discount_pct: discount_pct,
                discount_abs: discount_abs,
                category_id: category.id,
                category_name: category.name,
              };
            });
            return prodCardsData;
          },
          category
        );
        return prodCatalogueData;
      }

      // Pagination Logic with Scrape Current Page Function Called
      let nextPageButtonExists = true;
      let nextPageButtonDisabled = false;
      let currentPageData;
      let count = 1;

      while (nextPageButtonExists && !nextPageButtonDisabled) {
        currentPageData = await scrapeCurrentPage();

        scrapedCatPagesData = scrapedCatPagesData.concat(currentPageData);

        // Evaluate If Next Page Exists
        try {
          nextPageButtonExists = await page.$eval(
            "li.page-item > a.page-link > .icon-arrow-right",
            (a) => a
          );
          nextPageButtonExists = true;
        } catch (error) {
          nextPageButtonExists = false;
        }
        try {
          nextPageButtonDisabled = await page.$eval(
            "li.page-item.disabled > a.page-link > .icon-arrow-right",
            (a) => a
          );
          nextPageButtonDisabled = true;
        } catch (error) {
          nextPageButtonDisabled = false;
        }

        if (nextPageButtonExists && !nextPageButtonDisabled) {
          // await page.click("li.page-item > a.page-link > .icon-arrow-right");
          // await page.waitForTimeout(3000);

          await page.goto(
            `${category.urlAllProductPage}&currentPage=${count}`,
            {
              waitUntil: "networkidle0",
              timeout: 0,
            }
          );
        }

        // nextPageButtonExists = false;
        // nextPageButtonDisabled = true;
        count++;
        console.log(
          `loop ${count - 1} for ${category.name} - ${
            currentPageData.length
          } scrapped`
        );
      }
    }
    console.log(`Total Items Scrapped: ${scrapedCatPagesData.length}`);

    // Removes Duplicate Items in scrapedCatPagesData
    const seen = new Set();

    const filteredArr = scrapedCatPagesData.filter((el) => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });

    return filteredArr;
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
