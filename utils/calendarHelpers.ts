import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, getMonth } from "date-fns";

/**
 * Returns a flat array of 42 dates (6 weeks × 7 days)
 * that cover the visible calendar grid for the given month.
 */
export function buildCalendarGrid(year: number, month: number): Date[] {
  const firstDayOfMonth = startOfMonth(new Date(year, month, 1));
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);

  const gridStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }); // Sunday
  const gridEnd = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

/**
 * Returns true if the given date belongs to a different month than `currentMonth`.
 */
export function isAdjacentMonth(date: Date, currentMonth: number): boolean {
  return getMonth(date) !== currentMonth;
}

/** Day-of-week header labels */
export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
