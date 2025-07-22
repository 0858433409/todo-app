let CURRENT_USER_ID = null;

try {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    CURRENT_USER_ID = payload.user_id || payload.id;
  } else {
    throw new Error("Chưa đăng nhập");
  }
} catch (err) {
  console.error("❌ Không thể xác định user_id:", err);
  alert("Bạn cần đăng nhập trước khi truy cập block view.");
}

let editingTaskId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadKanbanData();

  const today = new Date().toISOString().split("T")[0];
  const dueDateField = document.getElementById("taskDueDate");
  if (dueDateField) dueDateField.value = today;

  const btn = document.getElementById("btnToggleForm");
  if (btn) {
    btn.addEventListener("click", () => {
      showCreateTaskForm();
    });
  }
});
