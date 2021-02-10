const jsonToExcel = require("./jsonToExcel");

// Get Product Links from Catalogue Page
async function getPageLinks(page, productBrand) {
  try {
    console.log(`Getting Page Links...... `);

    // Get the link to all the required books
    await page.waitForSelector(".brand-search-list");
    // Get the link to all the required books
    let urls = await page.$$eval(
      ".brand > a",
      (links, productBrand) => {
        // Finds _productBrand only Data, if not returns null
        links = links.map((links) => {
          if (
            links.textContent.toLowerCase().includes(productBrand.toLowerCase())
          ) {
            return links;
          } else {
            return null;
          }
        });

        // Finds removes all null
        links = links.filter((tx) => tx !== null);

        // Extract the links from the data
        links = links.map((brand) => {
          // Strips Url to get Brand Codes
          let brandCode = brand.href.replace(
            /https\:\/\/www\.watsons\.com\.my\/all-brands\/b\//,
            ""
          );
          brandCode = brandCode.replace(/\/.*/g, "");

          return {
            name: brand.textContent,
            url: brand.href,
            brandCode: brandCode,
          };
        });
        console.log(`Returning Page Links...... `);
        return links;
      },
      productBrand
    );
    return urls;
  } catch (error) {
    console.log(`getPageLinks Error: ${error}`);
  }
}

// Paginate Catalogue Page if Next Page Exist
async function paginate(page) {}

// Get Product Data from Product Page
async function getProductData(page) {}

module.exports = { getPageLinks, paginate, getProductData };
