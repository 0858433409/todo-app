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

let currentDate = new Date();

document.getElementById("prevWeek").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 7);
  updateWeekView();
});

document.getElementById("nextWeek").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 7);
  updateWeekView();
});

document.getElementById("datePicker").addEventListener("change", (e) => {
  currentDate = new Date(e.target.value);
  updateWeekView();
});

document.getElementById("btnCreateTask").addEventListener("click", () => {
  showCreateTaskForm();
});

function updateWeekView() {
  const weekRange = getWeekRange(currentDate);
  const weekNumber = getWeekNumber(currentDate);

  document.getElementById(
    "currentWeek"
  ).innerText = `Tuần ${weekNumber}: ${formatDate(
    weekRange.monday
  )} – ${formatDate(weekRange.sunday)}`;
  document.getElementById("datePicker").value = currentDate
    .toISOString()
    .split("T")[0];

  renderWeekColumns();
  fetchBlockTasks();
  fetchTaskSummary();
}

fetchAndShowUsername();
updateWeekView();
