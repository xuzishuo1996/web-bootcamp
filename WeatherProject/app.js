const express = require("express");
const https = require("https"); //native module - do not need npm install

const app = express();

// https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
// Use the 1st way: native https
app.get("/", (req, res) => {

  const url = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=36b83d1b75707ab79d26fc097f4442b0&units=metric";

  https.get(url, (res) => {
    console.log(res.statusCode);

    res.on("data", (data) => {
      const weatherData = JSON.parse(data);
      console.log(weatherData);
      const object = {
        name: "Angela",
        favoriteFood: "Apple"
      }
      console.log(JSON.stringify(object));
    })
  }).on("error", (e) => {
    console.error(e);
  });

  res.send("Server is up and running.");
});

app.listen(3000, (req, res) => {
  console.log("Server is listening at port 3000.");
});
