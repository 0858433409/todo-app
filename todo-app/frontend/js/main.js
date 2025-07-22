function loadIframe(path) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;
    const username = payload.username;

    const fullPath = `${path}?userId=${userId}&username=${encodeURIComponent(
      username
    )}`;
    document.getElementById("mainIframe").src = fullPath;
  } catch (err) {
    console.warn("Lỗi khi gắn user vào iframe:", err);
    document.getElementById("mainIframe").src = path; // fallback
  }
}

const menuItems = [
  {
    label: "Kanban",
    path: "./table/kanban/kanban.html",
    icon: "fa-table-columns",
  },
  { label: "Block", path: "./table/block/block.html", icon: "fa-layer-group" },
  { label: "Task", path: "./table/task/task.html", icon: "fa-tasks" },
];

function generateMenu() {
  const menu = document.querySelector(".menu");
  if (!menu) return;

  menu.innerHTML = "";

  menuItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "nav-link";
    li.innerHTML = `
      <a href="#" onclick="loadIframe('${item.path}')">
        <i class="fa-solid ${item.icon} icon"></i>
        <span class="text nav-text">${item.label}</span>
      </a>
    `;
    menu.appendChild(li);
  });
}

function showWelcomeUser() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const username = payload.username;
    document.getElementById("welcomeUser").textContent = username;
  } catch (err) {
    console.warn("Không thể giải mã token:", err);
  }
}

window.addEventListener("DOMContentLoaded", generateMenu);
window.addEventListener("DOMContentLoaded", showWelcomeUser);
