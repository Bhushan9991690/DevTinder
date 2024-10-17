const express = require("express");
const app = express();
app.use((req, res) => {
  res.send("Hello Bhushan Kumar!");
});
app.listen(3000, () => {
  console.log("Listening server 3000");
});
