function truncateText(text, wordLimit = 10) {
  const words = text.trim().split(/\s+/);
  return words.length <= wordLimit
    ? text
    : words.slice(0, wordLimit).join(" ") + "...";
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
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

function getColumnColor(statusName) {
  switch (statusName.toLowerCase()) {
    case "to do":
      return "#e3f2fd";
    case "doing":
      return "#fff3cd";
    case "done":
      return "#d1e7dd";
    case "overdue":
      return "#fde2e2";
    default:
      return "#f8f9fa";
  }
}
