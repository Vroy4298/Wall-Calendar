import { format, isSameDay, isWithinInterval, differenceInCalendarDays, startOfDay, parseISO, isValid } from "date-fns";

export { isSameDay };

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const s = start <= end ? start : end;
  const e = start <= end ? end : start;
  return isWithinInterval(startOfDay(date), { start: startOfDay(s), end: startOfDay(e) });
}

export function isRangeStart(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start) return false;
  const s = end && end < start ? end : start;
  return isSameDay(date, s);
}

export function isRangeEnd(date: Date, start: Date | null, end: Date | null): boolean {
  if (!end) return false;
  const e = start && start > end ? start : end;
  return isSameDay(date, e);
}

export function formatDateRange(start: Date | null, end: Date | null): string {
  if (!start) return "";
  if (!end) return format(start, "MMM d, yyyy");
  const days = Math.abs(differenceInCalendarDays(end, start)) + 1;
  return `${format(start, "MMM d")} → ${format(end, "MMM d, yyyy")} (${days} day${days > 1 ? "s" : ""})`;
}

export function getDaysBetween(start: Date, end: Date): number {
  return Math.abs(differenceInCalendarDays(end, start)) + 1;
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy");
}

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateKey(key: string): Date | null {
  try {
    const d = parseISO(key);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

export function getMonthKey(date: Date): string {
  return format(date, "yyyy-MM");
}
