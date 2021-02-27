const express = require("express");
const app = express();
// console.dir(app);

app.use((req, res, next) => {
  console.log("WE GOT A NEW MESSAGE!!");
  // console.log(req);
  // console.log(res);
  next();
});

app.get("/", (req, res) => {
  res.send("HELLO!");
});

app.listen(8080, () => {
  console.log("Listening in port 8080");
});
