const pool = require("../db");
const { getWeekRangeFromWeekNumber } = require("../utils/dateHelper.js"); // helper ta sẽ viết

// API: /api/block/:user_id?week=27
exports.getTaskBlockByWeek = async (req, res) => {
  const { user_id } = req.params;
  const week = parseInt(req.query.week) || getCurrentWeekNumber();
  const year = new Date().getFullYear();

  const { monday, sunday } = getWeekRangeFromWeekNumber(week, year);

  try {
    const result = await pool.query(
      `
      SELECT t.*, s.name AS status_name 
      FROM tasks t
      LEFT JOIN task_status s ON t.status_id = s.id
      WHERE t.user_id = $1 AND t.due_date BETWEEN $2 AND $3
      ORDER BY t.due_date
    `,
      [
        user_id,
        monday.toISOString().split("T")[0],
        sunday.toISOString().split("T")[0],
      ]
    );

    // phân task theo thứ trong tuần: 0 → 6
    const block = Array(7)
      .fill()
      .map(() => []);
    result.rows.forEach((task) => {
      const dayIndex = new Date(task.due_date).getDay(); // 0 = CN → 6 = T7
      const mappedIndex = (dayIndex + 6) % 7; // đưa CN về cuối cùng (vị trí 6)
      block[mappedIndex].push(task);
    });

    res.json({ week, tasks: block });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// API: /api/block/summary/:user_id?week=27
exports.getSummaryByWeek = async (req, res) => {
  const { user_id } = req.params;
  const week = parseInt(req.query.week) || getCurrentWeekNumber();
  const year = new Date().getFullYear();

  const { monday, sunday } = getWeekRangeFromWeekNumber(week, year);

  try {
    const result = await pool.query(
      `
      SELECT due_date, COUNT(*) as count
      FROM tasks
      WHERE user_id = $1 AND due_date BETWEEN $2 AND $3
      GROUP BY due_date
    `,
      [
        user_id,
        monday.toISOString().split("T")[0],
        sunday.toISOString().split("T")[0],
      ]
    );

    const summary = {};
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      summary[day.toISOString().split("T")[0]] = 0;
    }

    result.rows.forEach((row) => {
      const dateStr = new Date(row.due_date).toISOString().split("T")[0];
      summary[dateStr] = parseInt(row.count);
    });

    res.json({ week, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}
