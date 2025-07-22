function renderWeekColumns() {
  const weekRange = getWeekRange(currentDate);
  const container = document.getElementById("weekView");
  container.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekRange.monday);
    day.setDate(day.getDate() + i);
    const dayStr = day.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

    const col = document.createElement("div");
    col.style.flex = "0 0 14.2857%";
    col.style.boxSizing = "border-box";
    col.style.padding = "4px";

    col.innerHTML = `
        <div class="card h-100">
          <div class="card-header text-center fw-bold bg-light">${dayStr}</div>
          <div class="card-body" id="day-${i}"></div>
        </div>
      `;
    container.appendChild(col);
  }
}

function renderTasksByDay(blockArray, allStatuses) {
  for (let i = 0; i < 7; i++) {
    const dayContainer = document.getElementById(`day-${i}`);
    dayContainer.innerHTML = "";

    const tasks = blockArray[i];
    tasks.forEach((task) => {
      const taskBox = document.createElement("div");
      taskBox.className = "task-box mb-2 p-2 rounded border";
      taskBox.style.backgroundColor = getStatusColor(task.status_name);

      const statusOptions = allStatuses
        .map(
          (s) =>
            `<option value="${s.id}" ${
              task.status_id === s.id ? "selected" : ""
            }>${s.name}</option>`
        )
        .join("");

      taskBox.innerHTML = `
        <div class="fw-semibold">${task.title}</div>
        <div class="small text-muted">${formatDateDisplay(task.due_date)}</div>
        <select class="form-select form-select-sm mt-1" data-task-id="${
          task.id
        }">
          ${statusOptions}
        </select>
        <button class="btn btn-sm btn-outline-secondary mt-2 w-100 view-task-btn">Xem chi tiết</button>
      `;

      const select = taskBox.querySelector("select");
      select.addEventListener("change", () => {
        const newStatus = select.value;
        const taskId = select.dataset.taskId;
        updateTaskStatus(taskId, newStatus);
      });

      const btnView = taskBox.querySelector(".view-task-btn");
      btnView.addEventListener("click", () => {
        showTaskDetail(task);
      });

      dayContainer.appendChild(taskBox);
    });
  }
}

function applyOverloadWarning(summary) {
  const weekRange = getWeekRange(currentDate);
  Object.keys(summary).forEach((dateStr) => {
    const count = summary[dateStr];
    const dayDate = new Date(dateStr);
    const diff = Math.floor(
      (dayDate - weekRange.monday) / (1000 * 60 * 60 * 24)
    );
    if (diff < 0 || diff > 6) return;
    const card = document.getElementById(`day-${diff}`).parentElement;
    if (count > MAX_TASK_PER_DAY) {
      card.classList.add("border-danger");
    } else {
      card.classList.remove("border-danger");
    }
  });
}
