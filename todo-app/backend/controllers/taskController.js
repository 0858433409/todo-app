const pool = require("../db");

exports.createTask = async (req, res) => {
  const { user_id, title, description, due_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, due_date, status_id)
       VALUES ($1, $2, $3, $4, 1)
       RETURNING *`,
      [user_id, title, description, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.*, 
        s.name AS status_name 
      FROM tasks t
      LEFT JOIN task_status s ON t.status_id = s.id
      ORDER BY t.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasksByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        t.*, 
        s.name AS status_name
      FROM tasks t
      LEFT JOIN task_status s ON t.status_id = s.id
      WHERE t.user_id = $1
      ORDER BY t.id
    `,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        t.*, 
        s.name AS status_name 
      FROM tasks t
      LEFT JOIN task_status s ON t.status_id = s.id
      WHERE t.id = $1
    `,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Task not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, status_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, due_date = $3, status_id = $4
       WHERE id = $5 RETURNING *`,
      [title, description, due_date, status_id, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Task not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;

  console.log("🛠️ PUT /api/task:", { id, status_id });

  try {
    const result = await pool.query(
      "UPDATE tasks SET status_id = $1 WHERE id = $2",
      [parseInt(status_id), parseInt(id)]
    );

    console.log("🔍 UPDATE result:", result.rowCount);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Task không tồn tại hoặc không cập nhật được" });
    }

    return res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
