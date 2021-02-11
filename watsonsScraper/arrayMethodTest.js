let links = [
  {
    name: "abbott",
    url: "https://www.watsons.com.my/all-brands/b/152006/abbott",
    brandCode: "152006",
  },
  {
    name: "ABIB",
    url: "https://www.watsons.com.my/all-brands/b/152232/abib",
    brandCode: "152232",
  },
  {
    name: "ACEMD",
    url: "https://www.watsons.com.my/all-brands/b/152235/acemd",
    brandCode: "152235",
  },
  {
    name: "ADIDAS",
    url: "https://www.watsons.com.my/all-brands/b/152025/adidas",
    brandCode: "152025",
  },
];

let productBrand = "ABBOTT";

// links = links.map((links) => {
//   if (links.name.toLowerCase().includes(productBrand.toLowerCase())) {
//     return links;
//   } else {
//     return null;
//   }
// });
console.log(getBrandData(links, productBrand));

// links = links.filter((tx) => tx !== null);
// console.log(links);

function getBrandData(productCategoryData, categoryName) {
  const brand = productCategoryData.filter((Cat) => {
    return Cat.name.includes(categoryName.toLowerCase());
  });
  return brand;
}

const jsObjects = [
  { a: 1, b: 2 },
  { a: 3, b: 4 },
  { a: 5, b: 6 },
  { a: 7, b: 8 },
];

var result = jsObjects.filter((obj) => {
  return obj.b === 6;
});

console.log(result);
