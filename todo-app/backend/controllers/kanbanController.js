const pool = require("../db");

// Truy vấn danh sách status
async function fetchStatuses() {
  const result = await pool.query(
    "SELECT id AS status_id, name AS status_name FROM task_status ORDER BY id ASC"
  );
  console.log("✅ Lấy danh sách status:", result.rowCount);
  return result.rows;
}

// Truy vấn task theo user
async function fetchUserTasks(user_id) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC",
    [user_id]
  );
  console.log(`✅ Lấy ${result.rowCount} task của user ${user_id}`);
  return result.rows;
}

// Nhóm task theo status
function groupTasksByStatus(statuses, tasks) {
  return statuses.map((status) => ({
    ...status,
    tasks: tasks.filter((task) => task.status_id === status.status_id),
  }));
}

// API handler chính
exports.getKanbanData = async (req, res) => {
  const { user_id } = req.params;
  console.log(`📥 GET /api/kanban/${user_id}`);

  try {
    const statuses = await fetchStatuses();
    const tasks = await fetchUserTasks(user_id);
    const grouped = groupTasksByStatus(statuses, tasks);

    res.json(grouped);
  } catch (err) {
    console.error("❌ Lỗi khi lấy dữ liệu kanban:", err.message);
    res.status(500).json({ error: err.message });
  }
};
