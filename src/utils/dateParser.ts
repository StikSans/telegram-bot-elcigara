// вспомогательная функция для парсинга Date(YYYY,MM,DD)
function parseDateString(dateStr: string | null): string {
  if (!dateStr) return "";
  const match = dateStr.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (!match) return dateStr; // если не похоже на Date(...)
  const year = parseInt(match[1]);
  const month = parseInt(match[2]); // учти, что JS-месяцы 0-индексные
  const day = parseInt(match[3]);
  const date = new Date(year, month, day);
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}
export default parseDateString;