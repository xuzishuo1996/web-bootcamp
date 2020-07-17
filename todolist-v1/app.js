//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs"); //cannot use app.use, follow https://ejs.co
app.use(bodyParser.urlencoded({
  extended: true
}));

var items = ["Buy Food", "Eat Food", "Cook Food"];

app.get("/", (req, res) => {
  var today = new Date();
  var currentDay = today.getDay();
  var day = "";

  var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  var today  = new Date();
  var day = today.toLocaleDateString("en-US", options);

  res.render("list", {
    kindofDay: day,
    newListItems: items
  });
});

app.post("/", (req, res) => {
  var item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
