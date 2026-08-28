// DB dates are "YYYY-MM-DD"; <input type="month"> wants/gives "YYYY-MM".
export const toMonthInput = (date: string | null) => (date ? date.slice(0, 7) : "");
export const toDbDate = (month: string) => (month ? `${month}-01` : null);

export function formatDateRange(range: { start_date: string; end_date: string | null; is_current: boolean }) {
  const fmt = (date: string) => {
    const [y, m] = date.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  const start = fmt(range.start_date);
  if (range.is_current) return `${start} — Present`;
  return range.end_date ? `${start} — ${fmt(range.end_date)}` : start;
}
