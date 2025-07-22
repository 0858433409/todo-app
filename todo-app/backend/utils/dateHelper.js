exports.getWeekRangeFromWeekNumber = (week, year) => {
  const firstJan = new Date(year, 0, 1);
  const day = firstJan.getDay(); // 0 = Sun
  const dayOffset = day <= 4 ? day - 1 : day - 8; // ISO: tuần bắt đầu từ T2
  const monday = new Date(firstJan.setDate(1 - dayOffset + (week - 1) * 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
};
