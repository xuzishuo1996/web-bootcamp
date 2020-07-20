require('dotenv').config(); //As early as possible in your application, require and configure dotenv.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require('md5');
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

// for cookie and sessions
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// for cookie and sessions
// see http://www.passportjs.org/docs/configure/ middleware part
app.use(session({ //import the express-session package
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize()); //import the passport package
app.use(passport.session());

// db: userDB
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

// encryption: see https://www.npmjs.com/package/mongoose-encryption - Secret String Instead of Two Keys part
// encrypt on save() and decypt on find()
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Level 2: encrypt by a single string instead of two keys using mongoose-encryption
// userSchema.plugin(encrypt, {secret: process.env.API_KEY, encryptedFields: ["password"]});

// Level 5: cookie and session
userSchema.plugin(passportLocalMongoose);

//create a collection: users
const User = new mongoose.model("User", userSchema);

// for cookie and sessions - see https://www.npmjs.com/package/passport-local-mongoose: configure passport part
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home"); //home.ejs
});

app.get("/login", (req, res) => {
  res.render("login"); //login.ejs
});

app.get("/register", (req, res) => {
  res.render("register"); //register.ejs
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");  //secrets.ejs
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  // see http://www.passportjs.org/docs/logout/
  req.logout();
  res.redirect("/");
});

app.post("/register", (req, res) => {
  //comes from passport-local-mongoose
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      // see http://www.passportjs.org/docs/authenticate/
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  //comes from passport: see http://www.passportjs.org/docs/login/
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      // see http://www.passportjs.org/docs/authenticate/
      passport.authenticate("local")(req, res, () => {
        res.redirect("secrets");
      });
    }
  });
});

//for salt and hashing with bcrypt
// app.post("/register", (req, res) => {
//   // Level 4: bcrypt with salt
//   bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
//     const newUser = new User({
//       email: req.body.username,
//       password: hash
//     });
//     newUser.save((err) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.render("secrets");  //secrets.ejs
//       }
//     });
//   });
//
//   // Level 3: md5 hash
//   // const newUser = new User({
//   //   email: req.body.username,
//   //   password: md5(req.body.password)
//   // });
//   // newUser.save((err) => {
//   //   if (err) {
//   //     console.log(err);
//   //   } else {
//   //     res.render("secrets");  //secrets.ejs
//   //   }
//   // });
// });

//for salt and hashing with bcrypt
// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   // for md5 only
//   // const password = md5(req.body.password);
//
//   User.findOne({email: username}, (err, foundUser) => {
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundUser) {
//         bcrypt.compare(password, foundUser.password, (err, result) => {
//           if (result === true) {
//             res.render("secrets");
//           }
//         });
//         // if (foundUser.password === password) {
//         //   res.render("secrets");
//         // }
//       }
//     }
//   });
// });

app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
