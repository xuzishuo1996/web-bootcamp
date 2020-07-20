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

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const findOrCreate = require("mongoose-findorcreate");

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
  password: String,
  googleId: String, //for Google OAuth2.0 only
  secret: String
});

// Level 2: encrypt by a single string instead of two keys using mongoose-encryption
// userSchema.plugin(encrypt, {secret: process.env.API_KEY, encryptedFields: ["password"]});

// Level 5: cookie and session
userSchema.plugin(passportLocalMongoose);
// Level 6: Google OAuth2.0
userSchema.plugin(findOrCreate);  //mongoose-findorcreate package

//create a collection: users
const User = new mongoose.model("User", userSchema);

// for cookie and sessions - see https://www.npmjs.com/package/passport-local-mongoose: configure passport part
passport.use(User.createStrategy());
// below 2 only for local to create cookies
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// for local and other strategies
// see  http://www.passportjs.org/docs/configure/ sessions part
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo" // see https://github.com/jaredhanson/passport-google-oauth2/pull/51
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);

    // see https://stackoverflow.com/questions/20431049/what-is-function-user-findorcreate-doing-and-when-is-it-called-in-passport
    // findOrCreate is pseduo code used in passport doc
    User.findOrCreate({ googleId: profile.id }, function (err, user) {  //func name has to be the same with require statement
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
  res.render("home"); //home.ejs
});

// see for below 2 requests: http://www.passportjs.org/packages/passport-google-oauth20/  Authenticate Requests part
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/secrets");
  });

app.get("/login", (req, res) => {
  res.render("login"); //login.ejs
});

app.get("/register", (req, res) => {
  res.render("register"); //register.ejs
});

app.get("/secrets", (req, res) => {
  // see https://stackoverflow.com/questions/4057196/how-do-you-query-for-is-not-null-in-mongo
  User.find({"secret": {$ne:null}}, (err, foundUsers) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers});
      }
    }
  });
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");  //secrets.ejs
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

app.post("/submit", (req, res) => {
  const submittedSecret = req.body.secret;

  // console.log(req.user);
  User.findById(req.user.id, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(() => {
          res.redirect("/secrets");
        });
      }
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
