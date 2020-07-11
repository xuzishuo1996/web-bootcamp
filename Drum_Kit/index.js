var numOfDrumButtons = document.querySelectorAll(".drum").length;

for (var i = 0; i < numOfDrumButtons; ++i) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
    alert("I got clicked!");
  });
}
