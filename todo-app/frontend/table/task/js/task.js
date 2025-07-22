window.onload = function () {
  loadTasks();
};

function loadTasks() {
  getAllTasks()
    .then((tasks) => renderTaskList(tasks))
    .catch((err) => console.error("❌ Không load được task:", err));
}
