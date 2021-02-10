let links = [
  {
    name: "ABBOTT",
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

productBrand = "ABBOTT";

links = links.map((links) => {
  if (links.name.toLowerCase().includes(productBrand.toLowerCase())) {
    return links;
  } else {
    return null;
  }
});

links = links.filter((tx) => tx !== null);
console.log(links);
