const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
console.log(date);

const app = express();
app.set("view engine", "ejs"); //cannot use app.use, follow https://ejs.co
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Eat Food", "Cook Food"];
const workItems = [];

app.get("/", (req, res) => {
  const day = date.getDate();

  res.render("list", {
    listTitle: day,
    newListItems: items
  });
});

app.post("/", (req, res) => {
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

// app.post("/work", (req, res) => {
//   const item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("work");
// });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
