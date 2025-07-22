const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());

const client = require("prom-client");

// Khởi tạo Registry Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Tạo metric đo số lượng HTTP request
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Số lượng HTTP request theo method và route",
  labelNames: ["method", "route"],
});
register.registerMetric(httpRequestCounter);

// Middleware đo lường mỗi request
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.labels(req.method, req.path).inc();
  });
  next();
});

// Tạo endpoint để Prometheus scrape
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex.message);
  }
});

const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Ghi log request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Tự động load tất cả file trong routes/
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const routeName = file.replace(".js", "");
    const routePath = `/api/${routeName}`;
    try {
      const routeModule = require(`./routes/${file}`);
      if (typeof routeModule !== "function") {
        throw new Error(`Không export ra router từ ${file}`);
      }
      app.use(routePath, routeModule);
      console.log(`✅ Route loaded: ${routePath}`);
    } catch (err) {
      console.error(`❌ Route ${file} lỗi: ${err.message}`);
    }

    console.log(`✅ Route loaded: ${routePath}`);
  }
});
app.get("/", (req, res) => {
  res.send("Backend API đang chạy!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
