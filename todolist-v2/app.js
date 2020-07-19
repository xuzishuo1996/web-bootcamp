//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash"); //to keep the first letter of list name capitalized
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<-- Hit this to delete an item"
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {

    if (foundItems.length === 0) {

      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.console.log(err);
        } else {
          console.log("Successfully saved default items to DB");
        }
      });

      res.redirect("/");

    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems}); //first para: view name, i.e. list.ejs
    }

  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, (err, foundList) => {
    if (!err) {
      if (!foundList) {         //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {                  //Show an existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    } else {
      console.log(err);
    }
  });
});

app.post("/", (req, res) => {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (error, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete",(req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (!err) {
        console.log("Successfully deleted the checked item.");
        res.redirect("/");
      } else {
        console.log(err);
      }
    });
  } else {
    List.findOneAndUpdate(
      {name: listName}, //conditions
      {$pull: {items: {_id: checkedItemId}}},
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        } else {
          console.log(err);
        }
      }
    );
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
