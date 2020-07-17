//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

var today = new Date();
var currentDay = today.getDay();

app.get("/", (req, res) => {

  if (currentDay === 6 || currentDay === 0) {
    res.send("<h1>Yay it's the weekend<h1>");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
