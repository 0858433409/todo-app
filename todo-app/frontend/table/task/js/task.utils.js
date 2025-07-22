function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function truncateText(text, wordLimit = 10) {
  const words = text.trim().split(/\s+/);
  return words.length <= wordLimit
    ? text
    : words.slice(0, wordLimit).join(" ") + "...";
}

function getDeadlineStatus(dueDateStr) {
  const today = new Date();
  const dueDate = new Date(dueDateStr);
  const diffTime = dueDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "nearing";
  return "ok";
}

function getCurrentUserId() {
  const id = localStorage.getItem("user_id");
  return parseInt(id);
}
