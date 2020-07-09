//alert("working!"); //for test only
var rand1 = Math.floor(Math.random() * 6) + 1;  //[1-6]
var rand2 = Math.floor(Math.random() * 6) + 1;  //[1-6]

var randDiceImg1Src = "images/dice" + rand1 + ".png";
var randDiceImg2Src = "images/dice" + rand2 + ".png";

var images = document.querySelectorAll("img");
images[0].setAttribute("src", randDiceImg1Src);
images[1].setAttribute("src", randDiceImg2Src);

if (rand1 > rand2) {
  document.querySelector("h1").innerHTML = "Player 1 Wins!";
} else if (rand2 > rand1) {
  document.querySelector("h1").innerHTML = "Player 2 Wins!";
} else {
  document.querySelector("h1").innerHTML = "Draw!";
}
