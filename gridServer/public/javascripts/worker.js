let intervalId = null;
let subtasks = 1;
let completedSubtasks = 0;

function handleChange(event) {
  const option = event.target.value;
  const checkboxes = document.getElementsByName("option");
  const subtaskCount = document.getElementById("subtaskCompleted");
  const pointsObtained = document.getElementById("pointsObtained");

  if (option === "yes" && event.target.checked) {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      console.log(`Subtasks complete ${subtasks}`);
      subtaskCount.innerText = subtasks.toString();
      subtasks++;
    }, 5000);
    checkboxes[1].checked = false;
  } else if (option === "no" && event.target.checked) {
    console.log("Subtasked failed");
    console.log(`You have computed: ${subtasks - 1}`);

    clearInterval(intervalId);
    checkboxes[0].checked = false;
  } else {
    clearInterval(intervalId);
  }
}
