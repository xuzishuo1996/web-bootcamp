//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs"); //cannot use app.use, follow https://ejs.co
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let items = ["Buy Food", "Eat Food", "Cook Food"];

app.get("/", (req, res) => {
  // let today = new Date();
  // let currentDay = today.getDay();
  // let day = "";

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  let today  = new Date();
  let day = today.toLocaleDateString("en-US", options);

  res.render("list", {
    kindofDay: day,
    newListItems: items
  });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
