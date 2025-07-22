const MAX_TASK_PER_DAY = 5;

function getWeekRange(date) {
  const day = new Date(date);
  const dayOfWeek = day.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(day);
  monday.setDate(day.getDate() - diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

function getWeekNumber(date) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstJan.getDay() + 1) / 7);
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}

function formatDate(date) {
  return date.toLocaleDateString("vi-VN");
}

function getStatusColor(status) {
  switch (status) {
    case "To do":
      return "#f8d7da";
    case "Doing":
      return "#fff3cd";
    case "Done":
      return "#d1e7dd";
    default:
      return "#f0f0f0";
  }
}
