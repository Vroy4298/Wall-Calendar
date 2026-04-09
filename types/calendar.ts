export interface RangeNote {
  id: string;
  startKey: string; // "yyyy-MM-dd"
  endKey: string;   // "yyyy-MM-dd"
  text: string;
  label: string;    // e.g. "May 5 → May 12"
}

export interface CalendarNotes {
  monthlyNotes: Record<string, string>;   // monthKey ("yyyy-MM") → note text
  rangeNotes: RangeNote[];
}

export interface CalendarState {
  currentMonthISO: string;              // ISO string of first day of current month
  rangeStartISO: string | null;
  rangeEndISO: string | null;
  darkMode: boolean;
  notes: CalendarNotes;
}

export type AccentColor = [number, number, number]; // RGB tuple
