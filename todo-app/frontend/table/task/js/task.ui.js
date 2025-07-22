function renderTaskList(tasks) {
  const container = document.getElementById("taskList");
  container.innerHTML = "";

  if (tasks.length === 0) {
    container.innerHTML = "<p class='text-muted'>Không có task nào.</p>";
    return;
  }

  tasks.forEach((task) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "task-card";

    const title = document.createElement("h5");
    title.className = "fw-bold";
    title.innerText = task.title;

    const desc = document.createElement("p");
    desc.className = "mb-1 text-muted";
    desc.innerText = truncateText(task.description || "", 20);

    const deadline = document.createElement("div");
    const status = getDeadlineStatus(task.due_date);
    let badge = "";

    if (status === "overdue") {
      badge = `<span class="badge bg-danger ms-2">⛔ Trễ hạn</span>`;
    } else if (status === "nearing") {
      badge = `<span class="badge bg-warning text-dark ms-2">⚠️ Gần hạn</span>`;
    }

    deadline.innerHTML = `🕒 ${formatDate(task.due_date)} ${badge}`;

    const btnGroup = document.createElement("div");
    btnGroup.className = "mt-2 d-flex gap-2";

    const btnView = document.createElement("button");
    btnView.className = "btn btn-outline-primary btn-sm";
    btnView.innerText = "Xem";
    btnView.onclick = () => showEditTaskForm(task);

    const btnDelete = document.createElement("button");
    btnDelete.className = "btn btn-outline-danger btn-sm";
    btnDelete.innerText = "🗑️ Xoá";
    btnDelete.onclick = () => {
      if (confirm("Bạn có chắc muốn xoá task này?")) {
        deleteTask(task.id)
          .then(() => loadTasks())
          .catch((err) => alert("❌ " + err.message));
      }
    };

    btnGroup.appendChild(btnView);
    btnGroup.appendChild(btnDelete);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(deadline);
    card.appendChild(btnGroup);

    col.appendChild(card);
    container.appendChild(col);
  });
}

function filterTasks() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  getAllTasks()
    .then((tasks) => {
      const filtered = tasks.filter((t) =>
        t.title.toLowerCase().includes(keyword)
      );
      renderTaskList(filtered);
    })
    .catch((err) => console.error("❌ Lỗi khi tìm kiếm:", err));
}
