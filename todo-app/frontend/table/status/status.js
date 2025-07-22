let editingId = null;

const form = document.getElementById("statusForm");
const input = document.getElementById("statusName");
const table = document.getElementById("statusTable");
const button = document.getElementById("submitButton");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;

  if (editingId) {
    await fetch(`https://todo-backend2-41uh.onrender.com/api/status/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    editingId = null;
    button.innerText = "➕ Thêm";
  } else {
    await fetch("https://todo-backend2-41uh.onrender.com/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  }

  input.value = "";
  loadStatus();
});

function editStatus(id, name) {
  input.value = name;
  editingId = id;
  button.innerText = "💾 Cập nhật";
}

async function deleteStatus(id) {
  await fetch(`https://todo-backend2-41uh.onrender.com/api/status/${id}`, {
    method: "DELETE",
  });
  loadStatus();
}

async function loadStatus() {
  const res = await fetch("https://todo-backend2-41uh.onrender.com/api/status");
  const data = await res.json();
  table.innerHTML = "";

  data.forEach((s, i) => {
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${s.name}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editStatus(${
            s.id
          }, ${JSON.stringify(s.name)})">✏️ Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="deleteStatus(${
            s.id
          })">🗑️ Xoá</button>
        </td>
      </tr>
    `;
  });
}

loadStatus();
