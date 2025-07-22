function showCreateTaskForm() {
  document.getElementById("taskForm").reset();
  document.getElementById("taskId").value = "";
  document.getElementById("modalTitle").innerText = "Tạo Task";
  document.getElementById("deleteTaskBtn").classList.add("d-none");

  const todayStr = new Date().toISOString().split("T")[0];
  document.getElementById("taskDueDate").value = todayStr;
}

function showEditTaskForm(task) {
  document.getElementById("modalTitle").innerText = "Sửa Task";
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDesc").value = task.description || "";
  document.getElementById("taskDueDate").value = task.due_date.split("T")[0];
  document.getElementById("taskId").value = task.id;
  document.getElementById("deleteTaskBtn").classList.remove("d-none");

  const modal = new bootstrap.Modal(document.getElementById("taskModal"));
  modal.show();
}

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const task = {
    title: document.getElementById("taskTitle").value.trim(),
    description: document.getElementById("taskDesc").value.trim(),
    due_date: document.getElementById("taskDueDate").value,
    user_id: getCurrentUserId(),
    status_id: 1,
  };

  const taskId = document.getElementById("taskId").value;

  if (taskId) {
    updateTask(taskId, task)
      .then(() => {
        bootstrap.Modal.getInstance(
          document.getElementById("taskModal")
        ).hide();
        loadTasks();
      })
      .catch((err) => alert("⚠️ " + err.message));
  } else {
    createTask(task)
      .then(() => {
        bootstrap.Modal.getInstance(
          document.getElementById("taskModal")
        ).hide();
        loadTasks();
      })
      .catch((err) => alert("⚠️ " + err.message));
  }
});

document.getElementById("deleteTaskBtn").addEventListener("click", function () {
  const taskId = document.getElementById("taskId").value;
  if (!taskId) return;

  if (confirm("Bạn có chắc muốn xoá task này?")) {
    deleteTask(taskId)
      .then(() => {
        bootstrap.Modal.getInstance(
          document.getElementById("taskModal")
        ).hide();
        loadTasks();
      })
      .catch((err) => alert("❌ " + err.message));
  }
});
