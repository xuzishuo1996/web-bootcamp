const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));  //specify a static folder under curr path; for the server to load static files
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const fisrtName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fisrtName,
          LNAME: lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/6b48367249";
  // see https://nodejs.org/api/http.html#http_http_request_options_callback
  const options = {
    method: "POST",
    auth: "Zishuo:78928d55f5ca8774b294b0d847ad996e-us10"  //the first part does not matter
    // path: "/", //default is "/"
  }

  // var succeeded = false;
  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      const processedData = JSON.parse(data);
      console.log(processedData);
      // if (processedData.errors.length != 0) {
      //   document.querySelector(".display-4").textContent = e.errors.error;
      //   // $(".display-4").text(e.errors[0].error);
      //   res.sendFile(__dirname + "/failure.html");
      // } else {
      //   succeeded = true;
      //   res.sendFile(__dirname + "/success.html");
      // }
    })

    response.on('end', () => {
      console.log('No more data in response.');
    });
  });

  request.on('error', (e) => {
    console.log(e);
  });

  // if (succeeded) {
  //   request.write(jsonData);
  // }
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});
