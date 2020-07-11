var numOfDrumButtons = document.querySelectorAll(".drum").length;

//Detecting Button Press
for (var i = 0; i < numOfDrumButtons; ++i) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function() {
    makeSound(this.innerHTML);  //currentKey
    buttonAnimation(this.innerHTML);
  });
}

//Detecting Keyboard Press
document.addEventListener("keypress", function(event) {
  makeSound(event.key);
  buttonAnimation(event.key);
})

function makeSound(key) {
  var filename;
  switch (key) {
    case "w":
      filename = "tom-1";
      break;
    case "a":
      filename = "tom-2";
      break;
    case "s":
      filename = "tom-3";
      break;
    case "d":
      filename = "tom-4";
      break;
    case "j":
      filename = "snare";
      break;
    case "k":
      filename = "crash";
      break;
    case "l":
      filename = "kick-bass";
      break;
    default:
      console.log(this.innerHTML);
  }

  var audio = new Audio("sounds/" + filename + ".mp3");
  audio.play();
}

function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  activeButton.classList.add("pressed");  //not .pressed
  setTimeout(function() {
    activeButton.classList.remove("pressed");
  }, 1000);
}
