// ===== Autoload CSS files =====
const cssFiles = ["theme.css", "layout.css", "components.css"];

cssFiles.forEach((file) => {
  const path = `./css/${file}`;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = path;
  document.head.appendChild(link);
});

// ===== Autoload JS files =====
const jsFiles = ["main.js", "darkmode.js", "auth.js"];

jsFiles.forEach((file) => {
  const path = `./js/${file}`;
  const script = document.createElement("script");
  script.src = path;
  script.defer = true;
  document.body.appendChild(script);
});
