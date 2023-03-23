let intervalID;

function startLogging() {
  intervalID = setInterval(function () {
    console.log("Kører");
  }, 1000); // Run every 1 second (1000 milliseconds)
}

function stopLogging() {
  clearInterval(intervalID);
}
