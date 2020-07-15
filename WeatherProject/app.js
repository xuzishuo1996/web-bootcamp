const express = require("express");
const https = require("https"); //native module - do not need npm install

const app = express();

// https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
// Use the 1st way: native https
app.get("/", (req, res) => {

  const url = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=36b83d1b75707ab79d26fc097f4442b0&units=metric";

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
