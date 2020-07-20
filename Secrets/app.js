require('dotenv').config(); //As early as possible in your application, require and configure dotenv.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require('md5');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

// console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// db: userDB
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

// encryption: see https://www.npmjs.com/package/mongoose-encryption - Secret String Instead of Two Keys part
// encrypt on save() and decypt on find()
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Level 2: encrypt by a single string instead of two keys using mongoose-encryption
// userSchema.plugin(encrypt, {secret: process.env.API_KEY, encryptedFields: ["password"]});

//create a collection: users
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home"); //home.ejs
});

app.get("/login", (req, res) => {
  res.render("login"); //login.ejs
});

app.get("/register", (req, res) => {
  res.render("register"); //hregister.ejs
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // for md5 only
  // const password = md5(req.body.password);

  User.findOne({email: username}, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (result === true) {
            res.render("secrets");
          }
        });
        // if (foundUser.password === password) {
        //   res.render("secrets");
        // }
      }
    }
  });
});

app.post("/register", (req, res) => {

  // Level 4: bcrypt with salt
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");  //secrets.ejs
      }
    });
  });

  // Level 3: md5 hash
  // const newUser = new User({
  //   email: req.body.username,
  //   password: md5(req.body.password)
  // });
  // newUser.save((err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.render("secrets");  //secrets.ejs
  //   }
  // });
});

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
