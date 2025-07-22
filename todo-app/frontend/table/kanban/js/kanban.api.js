function updateTaskStatus(taskId, newStatusId) {
  fetch(`https://todo-backend2-41uh.onrender.com/api/task/${taskId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status_id: parseInt(newStatusId) }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Lỗi cập nhật trạng thái");
      return res.json();
    })
    .then(() => loadKanbanData())
    .catch((err) => console.error("❌ Lỗi khi cập nhật trạng thái:", err));
}

function deleteTask(taskId) {
  fetch(`https://todo-backend2-41uh.onrender.com/api/task/${taskId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Xoá thất bại");
      return res.json();
    })
    .then(() => {
      document.getElementById("taskModal").style.display = "none";
      loadKanbanData();
    })
    .catch((err) => console.error("❌ Lỗi khi xoá task:", err));
}

function loadKanbanData() {
  Promise.all([
    fetch(`https://todo-backend2-41uh.onrender.com/api/kanban/${CURRENT_USER_ID}`).then((res) =>
      res.json()
    ),
    fetch(`https://todo-backend2-41uh.onrender.com/api/status`).then((res) => res.json()),
  ])
    .then(([kanbanData, allStatuses]) => {
      const overdueTasks = [];
      kanbanData.forEach((status) => {
        status.tasks = status.tasks.filter((task) => {
          const isOverdue = getDeadlineStatus(task.due_date) === "overdue";
          if (isOverdue) overdueTasks.push(task);
          return !isOverdue;
        });
      });

      const kanbanWithOverdue = [
        { status_id: -1, status_name: "overdue", tasks: overdueTasks },
        ...kanbanData,
      ];

      renderKanbanBoard(kanbanWithOverdue, allStatuses);
    })
    .catch((err) => console.error("❌ Lỗi khi load Kanban:", err));
}
