const express = require("express");
const router = express.Router();
const pool = require("../db/index");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ server_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
