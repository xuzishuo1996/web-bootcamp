const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser: true, useUnifiedTopology: true});

const fruitSchema = new mongoose.Schema ({
  name: {
    type: String,
    // required: [true, "Please check your data entry, name field is required!"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

//Fruit collection inside fruitsDB
const Fruit = mongoose.model("Fruit", fruitSchema); //will automatically to fruits

const fruit = new Fruit ({  // a new document
  name: "Peach",
  rating: 7,
  review: "Not bad"
});

// fruit.save();

// const personSchema = new mongoose.Schema({
//   name: String,
//   age: Number
// });
//
// const Person = mongoose.model("Person", personSchema);   //will automatically to people
//
// const person = new Person({
//   name: "John",
//   age: 37
// });

// person.save();

// const kiwi = new Fruit({
//   name: "Kiwi",
//   score: 10,
//   review: "The best fruit!"
// });
//
// const orange = new Fruit({
//   name: "Orange",
//   score: 4,
//   review: "Too sour for me!"
// });
//
// const banana = new Fruit({
//   name: "Banana",
//   score: 3,
//   review: "Weird texture!"
// });

// Fruit.insertMany([kiwi, orange, banana], (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully saved all the fruits to fruitsDB");
//   }
// });

// Fruit.updateOne({_id: "5f12db3e9cd1f30286c34c98"}, {name: "Peach"}, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully updated the document");
//   }
// });

// Fruit.deleteOne({name: "Peach"}, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Successfully deleted the document");
//     }
// });

// Person.deleteOne({name: "John"}, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Successfully deleted all the documents");
//     }
// });

Fruit.find((err, fruits) => {
  if (err) {
    console.log(err);
  } else {
    mongoose.connection.close();
    fruits.forEach((fruit) => {
      console.log(fruit.name);
    });
  }
});
