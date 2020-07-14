const express = require("express");

const app = express();

app.get("/", function(req, res) {
  // console.log(request);  //messages appear on terminal
  res.send("<h1>Hello, world</h1>");
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
