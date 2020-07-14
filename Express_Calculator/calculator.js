const express = require("express");
const bodyParse = require("body-parser");

const app = express();
app.use(bodyParse.urlencoded({extended: true}));

const port = 3000;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  // console.log(req.body);
  // console.log(req.body.num1);

  var num1 = Number(req.body.num1);
  var num2 = Number(req.body.num2);
  var result = num1 + num2;

  res.send("The result is: " + result);
});

app.get("/bmiCalculator", (req, res) => {
  res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmiCalculator", (req, res) => {
  var weight = Number(req.body.weight);
  var height = Number(req.body.height);
  var result = weight / height / height;
  res.send("Your BMI is: " + result);
});
