var timeLeft = 300;

function updateUI() {
  if (timeLeft > 0){
    timeLeft -= 1;
  }
  var minutes = parseInt(timeLeft / 60);
  var seconds = timeLeft % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var text = minutes + ":" + seconds;

  $("#clock").text(text);
  $("title").text(text + " Relax");
}

setInterval(function () {
  updateUI();
}, 1000);