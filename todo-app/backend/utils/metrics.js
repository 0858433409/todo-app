const express = require("express");
const client = require("prom-client");

const app = express();

// Tạo registry riêng cho metric
const register = new client.Registry();

// Metric mẫu: đếm số lượng request
const counter = new client.Counter({
  name: "node_request_count",
  help: "Tổng số lượng request đến server",
});
register.registerMetric(counter);

// Middleware tăng counter
app.use((req, res, next) => {
  counter.inc();
  next();
});

// Endpoint /metrics để Prometheus scrape
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log("Web server chạy tại https://todo-backend2-41uh.onrender.com");
});
