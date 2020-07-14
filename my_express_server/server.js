const express = require("express");

const app = express();

app.get("/", function(req, res) {
  // console.log(request);  //messages appear on terminal
  res.send("<h1>Hello, world</h1>");
});

app.get("/contact", function(req, res) {
  res.send("Contact me at: xuzishuo1996@gmail.com");
});

app.get("/about", function(req, res) {
  res.send("My name is Zishuo.");
});

app.get("/hobbies", function(req, res) {
  res.send("<ul><li>volleyball</li><li>badminton</li></ul>");
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
