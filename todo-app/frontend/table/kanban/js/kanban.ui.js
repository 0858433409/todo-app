function createTaskCard(task, allStatuses) {
  const card = document.createElement("div");
  card.className = "task-card";

  const title = document.createElement("div");
  title.className = "fw-bold";
  title.innerText = task.title;

  const desc = document.createElement("div");
  desc.innerText = truncateText(task.description || "");

  const deadline = document.createElement("div");
  deadline.className = "task-deadline";

  const status = getDeadlineStatus(task.due_date);
  let label = "";
  if (status === "overdue") {
    label = '<span class="badge bg-danger ms-2">⛔ Trễ hạn</span>';
    card.style.backgroundColor = "#f8d7da";
  } else if (status === "nearing") {
    label = '<span class="badge bg-warning text-dark ms-2">⚠️ Gần hạn</span>';
    card.style.backgroundColor = "#fff3cd";
  } else {
    card.style.backgroundColor = "#ffffff";
  }
  deadline.innerHTML = `🕒 ${formatDate(task.due_date)} ${label}`;

  const dropdown = document.createElement("select");
  dropdown.className = "form-select form-select-sm mt-2";
  allStatuses.forEach((status) => {
    const option = document.createElement("option");
    option.value = status.id;
    option.innerText = status.name;
    if (status.id === task.status_id) option.selected = true;
    dropdown.appendChild(option);
  });

  if (status === "overdue") {
    dropdown.disabled = true;
    const warning = document.createElement("div");
    warning.className = "small text-danger mt-1";
    warning.innerText = "⚠️ Cập nhật hạn mới để chuyển trạng thái";
    card.appendChild(warning);
  } else {
    dropdown.addEventListener("change", () => {
      updateTaskStatus(task.id, dropdown.value);
    });
  }

  const btnDetail = document.createElement("button");
  btnDetail.className = "btn btn-outline-secondary btn-sm mt-2";
  btnDetail.innerText = "Xem chi tiết";
  btnDetail.addEventListener("click", () => showTaskDetail(task));

  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(deadline);
  card.appendChild(dropdown);
  card.appendChild(btnDetail);

  return card;
}

function createKanbanColumn(status, allStatuses) {
  const col = document.createElement("div");
  col.className = "kanban-column";
  col.style.backgroundColor = getColumnColor(status.status_name);

  const header = document.createElement("div");
  header.className = "status-header";
  header.innerHTML = `<span class="me-1">${status.status_name}</span> <span class="badge bg-secondary">${status.tasks.length}</span>`;

  col.appendChild(header);

  status.tasks.forEach((task) => {
    const card = createTaskCard(task, allStatuses);
    col.appendChild(card);
  });

  return col;
}

function renderKanbanBoard(data, allStatuses) {
  const board = document.getElementById("kanbanBoard");
  board.innerHTML = "";
  data.forEach((status) => {
    const column = createKanbanColumn(status, allStatuses);
    board.appendChild(column);
  });
}

function clearFormFields() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  editingTaskId = null;
}
