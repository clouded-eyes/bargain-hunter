const Excel = require("exceljs");

// let jsonBookCatalogueData = {
//   Travel: [
//     {
//       bookTitle: "It's Only the Himalayas",
//       bookPrice: "£45.17",
//       noAvailable: "19",
//       imageUrl:
//         "http://books.toscrape.com/media/cache/6d/41/6d418a73cc7d4ecfd75ca11d854041db.jpg",
//       bookDescription:
//         '“Wherever you go, whatever you do, just . . . don’t do anything stupid.” —My MotherDuring her yearlong adventure backpacking from South Africa to Singapore, S. Bedford definitely did a few things her mother might classify as "stupid." She swam with great white sharks in South Africa, ran from lions in Zimbabwe, climbed a Himalayan mountain without training in Nepal, and wa “Wherever you go, whatever you do, just . . . don’t do anything stupid.” —My MotherDuring her yearlong adventure backpacking from South Africa to Singapore, S. Bedford definitely did a few things her mother might classify as "stupid." She swam with great white sharks in South Africa, ran from lions in Zimbabwe, climbed a Himalayan mountain without training in Nepal, and watched as her friend was attacked by a monkey in Indonesia.But interspersed in those slightly more crazy moments, Sue Bedfored and her friend "Sara the Stoic" experienced the sights, sounds, life, and culture of fifteen countries. Joined along the way by a few friends and their aging fathers here and there, Sue and Sara experience the trip of a lifetime. They fall in love with the world, cultivate an appreciation for home, and discover who, or what, they want to become.It\'s Only the Himalayas is the incredibly funny, sometimes outlandish, always entertaining confession of a young backpacker that will inspire you to take your own adventure. ...more',
//       upc: "a22124811bfa8350",
//     },
//     {
//       bookTitle:
//         "Full Moon over Noah’s Ark: An Odyssey to Mount Ararat and Beyond",
//       bookPrice: "£49.43",
//       noAvailable: "15",
//       imageUrl:
//         "http://books.toscrape.com/media/cache/fe/8a/fe8af6ceec7718986380c0fde9b3b34f.jpg",
//       bookDescription:
//         "Acclaimed travel writer Rick Antonson sets his adventurous compass on Mount Ararat, exploring the region’s long history, religious mysteries, and complex politics.Mount Ararat is the most fabled mountain in the world. For millennia this massif in eastern Turkey has been rumored as the resting place of Noah’s Ark following the Great Flood. But it also plays a significant ro Acclaimed travel writer Rick Antonson sets his adventurous compass on Mount Ararat, exploring the region’s long history, religious mysteries, and complex politics.Mount Ararat is the most fabled mountain in the world. For millennia this massif in eastern Turkey has been rumored as the resting place of Noah’s Ark following the Great Flood. But it also plays a significant role in the longstanding conflict between Turkey and Armenia.Author Rick Antonson joined a five-member expedition to the mountain’s nearly 17,000-foot summit, trekking alongside a contingent of Armenians, for whom Mount Ararat is the stolen symbol of their country. Antonson weaves vivid historical anecdote with unexpected travel vignettes, whether tracing earlier mountaineering attempts on the peak, recounting the genocide of Armenians and its unresolved debate, or depicting the Kurds’ ambitions for their own nation’s borders, which some say should include Mount Ararat.What unfolds in Full Moon Over Noah’s Ark is one man’s odyssey, a tale told through many stories. Starting with the flooding of the Black Sea in 5600 BCE, through to the Epic of Gilgamesh and the contrasting narratives of the Great Flood known to followers of the Judaic, Christian and Islamic religions, Full Moon Over Noah’s Ark takes readers along with Antonson through the shadows and broad landscapes of Turkey, Iraq, Iran and Armenia, shedding light on a troubled but fascinating area of the world. ...more",
//       upc: "ce60436f52c5ee68",
//     },
//   ],
// };

// jsonToExcel(jsonBookCatalogueData, "bookData2.xlsx", 1);

async function jsonObjectToExcel(json, filename, categoryLvls) {
  // Initiate New Worbook
  const workbook = new Excel.Workbook();
  // Create Worksheet for Book Category
  const worksheet = workbook.addWorksheet("Book Data");

  // For Each Book Category
  for (const jsonKeys of Object.keys(json)) {
    // Initiate Data
    let bookCategory = jsonKeys;
    let bookDataAll = json[jsonKeys];
    let bookDataHeaders = Object.keys(json[jsonKeys][0]);
    for (let i = categoryLvls; i > 0; i--) {
      bookDataHeaders.unshift(`Cat_${i}`);
    }

    // Add Headers to Worksheet if not present
    if (!worksheet.columns) {
      let worksheetColumns = bookDataHeaders.map((header) => {
        return { header: header, key: header };
      });
      worksheet.columns = worksheetColumns;
      // console.log(worksheet.columns);
    }

    // Add all Data Rows
    for (const bookDataSingle of bookDataAll) {
      bookDataSingle.Cat_1 = jsonKeys;
      worksheet.addRow(bookDataSingle);
    }
    // Writes Workbook
    await workbook.xlsx.writeFile(filename + ".xlsx");
  }

  console.log("File is written");
}

// let jsonBookCatalogueData = [
//   {
//     bookTitle: "It's Only the Himalayas",
//     bookPrice: "£45.17",
//     noAvailable: "19",
//     imageUrl:
//       "http://books.toscrape.com/media/cache/6d/41/6d418a73cc7d4ecfd75ca11d854041db.jpg",
//     bookDescription:
//       '“Wherever you go, whatever you do, just . . . don’t do anything stupid.” —My MotherDuring her yearlong adventure backpacking from South Africa to Singapore, S. Bedford definitely did a few things her mother might classify as "stupid." She swam with great white sharks in South Africa, ran from lions in Zimbabwe, climbed a Himalayan mountain without training in Nepal, and wa “Wherever you go, whatever you do, just . . . don’t do anything stupid.” —My MotherDuring her yearlong adventure backpacking from South Africa to Singapore, S. Bedford definitely did a few things her mother might classify as "stupid." She swam with great white sharks in South Africa, ran from lions in Zimbabwe, climbed a Himalayan mountain without training in Nepal, and watched as her friend was attacked by a monkey in Indonesia.But interspersed in those slightly more crazy moments, Sue Bedfored and her friend "Sara the Stoic" experienced the sights, sounds, life, and culture of fifteen countries. Joined along the way by a few friends and their aging fathers here and there, Sue and Sara experience the trip of a lifetime. They fall in love with the world, cultivate an appreciation for home, and discover who, or what, they want to become.It\'s Only the Himalayas is the incredibly funny, sometimes outlandish, always entertaining confession of a young backpacker that will inspire you to take your own adventure. ...more',
//     upc: "a22124811bfa8350",
//   },
//   {
//     bookTitle:
//       "Full Moon over Noah’s Ark: An Odyssey to Mount Ararat and Beyond",
//     bookPrice: "£49.43",
//     noAvailable: "15",
//     imageUrl:
//       "http://books.toscrape.com/media/cache/fe/8a/fe8af6ceec7718986380c0fde9b3b34f.jpg",
//     bookDescription:
//       "Acclaimed travel writer Rick Antonson sets his adventurous compass on Mount Ararat, exploring the region’s long history, religious mysteries, and complex politics.Mount Ararat is the most fabled mountain in the world. For millennia this massif in eastern Turkey has been rumored as the resting place of Noah’s Ark following the Great Flood. But it also plays a significant ro Acclaimed travel writer Rick Antonson sets his adventurous compass on Mount Ararat, exploring the region’s long history, religious mysteries, and complex politics.Mount Ararat is the most fabled mountain in the world. For millennia this massif in eastern Turkey has been rumored as the resting place of Noah’s Ark following the Great Flood. But it also plays a significant role in the longstanding conflict between Turkey and Armenia.Author Rick Antonson joined a five-member expedition to the mountain’s nearly 17,000-foot summit, trekking alongside a contingent of Armenians, for whom Mount Ararat is the stolen symbol of their country. Antonson weaves vivid historical anecdote with unexpected travel vignettes, whether tracing earlier mountaineering attempts on the peak, recounting the genocide of Armenians and its unresolved debate, or depicting the Kurds’ ambitions for their own nation’s borders, which some say should include Mount Ararat.What unfolds in Full Moon Over Noah’s Ark is one man’s odyssey, a tale told through many stories. Starting with the flooding of the Black Sea in 5600 BCE, through to the Epic of Gilgamesh and the contrasting narratives of the Great Flood known to followers of the Judaic, Christian and Islamic religions, Full Moon Over Noah’s Ark takes readers along with Antonson through the shadows and broad landscapes of Turkey, Iraq, Iran and Armenia, shedding light on a troubled but fascinating area of the world. ...more",
//     upc: "ce60436f52c5ee68",
//   },
// ];

// jsonToExcel2(jsonBookCatalogueData, "HELLOWORLD!");

async function jsonArrayToExcel(jsonArray, filename) {
  // Initiate New Worbook
  const workbook = new Excel.Workbook();

  // Create Worksheet for Book Category
  const worksheet = workbook.addWorksheet("Scrapped Data");

  // Set Header Column
  const firstItem = jsonArray[0];
  const excelHeaders = Object.keys(firstItem);
  worksheet.columns = excelHeaders.map((header) => {
    return { header: header, key: header };
  });

  // Adds each json individually
  for (const items of jsonArray) {
    worksheet.addRow(items);
  }

  // Writes Workbook
  await workbook.xlsx.writeFile(filename + ".xlsx");
}

module.exports = { jsonObjectToExcel, jsonArrayToExcel };
