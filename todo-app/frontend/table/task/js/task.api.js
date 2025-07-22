function getAllTasks() {
  const userId = getCurrentUserId();
  return fetch(`http://localhost:3000/api/task/${userId}`).then((res) => {
    if (!res.ok) throw new Error("Lỗi khi tải danh sách task");
    return res.json();
  });
}

function createTask(task) {
  const userId = getCurrentUserId();
  return fetch(`http://localhost:3000/api/task/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  }).then((res) => {
    if (!res.ok) throw new Error("Lỗi khi tạo task");
    return res.json();
  });
}

function updateTask(taskId, updatedTask) {
  return fetch(`http://localhost:3000/api/task/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask),
  }).then((res) => {
    if (!res.ok) throw new Error("Lỗi khi cập nhật task");
    return res.json();
  });
}

function deleteTask(taskId) {
  return fetch(`http://localhost:3000/api/task/${taskId}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("Xoá task thất bại");
    return res.json();
  });
}
