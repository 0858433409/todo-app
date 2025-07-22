function showCreateTaskForm() {
  const modal = document.getElementById("taskModal");
  modal.style.display = "block";

  const today = new Date().toISOString().split("T")[0];

  document.getElementById(
    "taskModalTitle"
  ).innerHTML = `<input id="modalEditTitle" class="form-control" placeholder="Tiêu đề task" />`;
  document.getElementById(
    "taskModalDesc"
  ).innerHTML = `<textarea id="modalEditDesc" class="form-control" rows="3" placeholder="Mô tả (tuỳ chọn)"></textarea>`;
  document.getElementById(
    "taskModalDue"
  ).innerHTML = `🕒 Hạn chót: <input id="modalEditDue" type="date" class="form-control form-control-sm mt-1" value="${today}" />`;
  document.getElementById("taskModalStatus").innerText = "";

  document.getElementById("btnDeleteTask").style.display = "none";
  document.getElementById("btnEditTask").innerText = "➕ Tạo";

  document.getElementById("btnEditTask").onclick = () => {
    const title = document.getElementById("modalEditTitle").value.trim();
    const description = document.getElementById("modalEditDesc").value.trim();
    const due_date = document.getElementById("modalEditDue").value;

    if (!title || !due_date) {
      alert("⚠️ Cần nhập tiêu đề và hạn chót");
      return;
    }

    const task = {
      title,
      description,
      due_date,
      status_id: 1,
      user_id: CURRENT_USER_ID,
    };

    fetch(`https://todo-backend2-41uh.onrender.com/api/task/${CURRENT_USER_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi tạo task");
        return res.json();
      })
      .then(() => {
        modal.style.display = "none";
        loadKanbanData();
      })
      .catch((err) => console.error("❌ Lỗi khi tạo task:", err));
  };
}

function showTaskDetail(task) {
  const modal = document.getElementById("taskModal");
  modal.style.display = "block";

  document.getElementById(
    "taskModalTitle"
  ).innerHTML = `<input id="modalEditTitle" class="form-control" value="${task.title}"/>`;
  document.getElementById(
    "taskModalDesc"
  ).innerHTML = `<textarea id="modalEditDesc" class="form-control" rows="3">${
    task.description || ""
  }</textarea>`;
  document.getElementById(
    "taskModalDue"
  ).innerHTML = `🕒 Hạn chót: <input id="modalEditDue" type="date" class="form-control form-control-sm mt-1" value="${
    task.due_date.split("T")[0]
  }" />`;

  const btnDelete = document.getElementById("btnDeleteTask");
  btnDelete.style.display = "inline-block";
  btnDelete.onclick = () => {
    if (confirm("Bạn có chắc muốn xoá task này?")) {
      deleteTask(task.id);
    }
  };

  const btnEdit = document.getElementById("btnEditTask");
  btnEdit.innerText = "💾 Lưu";
  btnEdit.onclick = () => {
    const updated = {
      title: document.getElementById("modalEditTitle").value.trim(),
      description: document.getElementById("modalEditDesc").value.trim(),
      due_date: document.getElementById("modalEditDue").value,
      status_id: task.status_id,
    };

    if (!updated.title || !updated.due_date) {
      alert("⚠️ Thiếu tiêu đề hoặc hạn chót!");
      return;
    }

    fetch(`https://todo-backend2-41uh.onrender.com/api/task/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        return res.json();
      })
      .then(() => {
        modal.style.display = "none";
        loadKanbanData();
      })
      .catch((err) => console.error("❌ Lỗi khi cập nhật task:", err));
  };
}
