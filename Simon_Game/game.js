var buttonColors = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
// unmuteAllButton();

// To solve the failure of playSound() in nextSequence()
// function unmuteAllButton() {
//   $(document).attr("muted", false);
//   // $("btn").attr("muted", false);
// }

//press any key to start the game
$(document).keydown(function() {
  if (!started) { //started === false
    started = true;
    level = 0;
    nextSequence();
  }
});

//use jquery to detect that the user has clicked a button
$(".btn").click(function() {
  var userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);
  console.log("userClickedPattern: " + userClickedPattern);

  playSound(userChosenColor);
  animatePress(userChosenColor);

  checkAnswer(userClickedPattern.length - 1);
});

//go to next round
function nextSequence() {
  ++level;
  $("#level-title").text("Level " + level);

  var rand = Math.floor(Math.random() * 4);
  var randChosenColor = buttonColors[rand];
  gamePattern.push(randChosenColor);
  console.log("gamePattern: " + gamePattern);

  $(chosedId = "#" + randChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
  // playSound(randChosenColor);
  // DOMException: play() failed because the user didn't interact with the document first.
  // https://goo.gl/xX8pDD
}

function checkAnswer(currentLevel) {
  if (userClickedPattern.length === gamePattern.length &&
    userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    console.log("right");
    setTimeout(nextSequence, 1000);
  } else {
    console.log("wrong");
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game Over, Press Any Key to Restart");
  }

  // var right = true;
  // userClickedPattern.forEach((elem, i) => {
  //     if (i >= gamePattern.length || elem !== gamePattern[i]) {
  //       completed = false;
  //     }
  // });
  // if (right) {
  //   console.log("right");
  //   setTimeout(nextSequence, 1000);
  // } else {
  //   console.log("wrong");
  // }
}

function startOver() {
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  level = 0;
}

//animation after the a button has been clicked
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(elem) {
  var audio = new Audio("sounds/" + elem + ".mp3");
  // audio.muted = true;  //see HTMLMediaElement
  // audio.play();

  var promise = audio.play();
  if (promise !== undefined) {
    promise.then(_ => {
      audio.play();
    }).catch(error => {
      // Autoplay was prevented.
      // Show a "Play" button so that user can start playback.
      console.log(error);
    });
  }
}
