// Kết nối PostgreSQL
const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "todoapp",
//   password: "12345",
//   //   database: "todo_app", // CSDL trong pg
//   //   password: "your_password", // Pass trong pg
//   port: 5432,
// });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
