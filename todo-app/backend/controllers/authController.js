const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER - POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const check = await pool.query("SELECT id FROM users WHERE username = $1", [
      username,
    ]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, password_hash]
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN - POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      "secret_key",
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user_id: user.id,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
