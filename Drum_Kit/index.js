var numOfDrumButtons = document.querySelectorAll(".drum").length;

for (var i = 0; i < numOfDrumButtons; ++i) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function() {
    var filename;
    switch (this.innerHTML) {
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
  });
}
