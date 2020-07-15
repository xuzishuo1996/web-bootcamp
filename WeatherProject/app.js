const express = require("express");
const https = require("https"); //native module - do not need npm install
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true})); //routine code for using body-parser package

// https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
// Use the 1st way: native https
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = "36b83d1b75707ab79d26fc097f4442b0";
  const unit ="metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, (response) => {
    console.log(response.statusCode);

    response.on("data", (data) => {  //"data": when received data
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<h1>The temperature in London is " + temp + " degrees Celcius.</h1>");
      res.write("<p>The weather is currently " + weatherDescription + "</p>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });

  }).on("error", (e) => {
    console.error(e);
  });
});

app.listen(3000, (req, res) => {
  console.log("Server is listening at port 3000.");
});
