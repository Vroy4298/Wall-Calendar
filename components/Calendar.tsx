"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useRangeSelection } from "@/hooks/useRangeSelection";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import HeroImage from "./HeroImage";
import MonthNavigator from "./MonthNavigator";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import RangePreview from "./RangePreview";
import type { CalendarNotes, AccentColor } from "@/types/calendar";
import { formatDateKey, getMonthKey, parseDateKey } from "@/utils/dateHelpers";
import { format } from "date-fns";

const EMPTY_NOTES: CalendarNotes = { monthlyNotes: {}, rangeNotes: [] };

export default function Calendar() {
  /* ── Persistence ── */
  const [savedMonth, setSavedMonth] = useLocalStorage<string | null>("cal-month", null);
  const [savedRangeStart, setSavedRangeStart] = useLocalStorage<string | null>("cal-range-start", null);
  const [savedRangeEnd, setSavedRangeEnd] = useLocalStorage<string | null>("cal-range-end", null);
  const [notes, setNotes] = useLocalStorage<CalendarNotes>("cal-notes", EMPTY_NOTES);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("cal-dark-mode", false);

  /* ── Calendar navigation ── */
  const initialDate = useMemo(() => {
    if (savedMonth) {
      const d = parseDateKey(savedMonth + "-01");
      if (d) return d;
    }
    return new Date();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { currentDate, goNextMonth, goPrevMonth, goToToday } = useCalendar(initialDate);
  const [direction, setDirection] = useState(0);

  // Persist month
  useEffect(() => { setSavedMonth(getMonthKey(currentDate)); }, [currentDate, setSavedMonth]);

  const handleNext = useCallback(() => { setDirection(1); goNextMonth(); }, [goNextMonth]);
  const handlePrev = useCallback(() => { setDirection(-1); goPrevMonth(); }, [goPrevMonth]);

  /* ── Range selection ── */
  const {
    rangeStart, rangeEnd, hoverDate, previewEnd,
    handleDayMouseDown, handleDayMouseEnter, handleDayMouseUp,
    handleDayClick, clearSelection,
  } = useRangeSelection();

  // Restore persisted range on mount (only once)
  const rangeRestored = useRef(false);
  // (We don't auto-restore range dates for UX simplicity — user can re-select)

  // Persist range
  useEffect(() => {
    setSavedRangeStart(rangeStart ? formatDateKey(rangeStart) : null);
    setSavedRangeEnd(rangeEnd ? formatDateKey(rangeEnd) : null);
  }, [rangeStart, rangeEnd, setSavedRangeStart, setSavedRangeEnd]);

  /* ── Keyboard: Escape to clear ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [clearSelection]);

  /* ── Swipe for mobile ── */
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
  }, [handleNext, handlePrev]);

  /* ── Dark mode ── */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDark = useCallback(() => setDarkMode((d) => !d), [setDarkMode]);

  /* ── Accent colour from hero image ── */
  const [accent, setAccent] = useState<AccentColor>([99, 102, 241]);
  const handleColorExtracted = useCallback((rgb: AccentColor) => {
    setAccent(rgb);
    document.documentElement.style.setProperty("--accent", `${rgb[0]} ${rgb[1]} ${rgb[2]}`);
    // Compute lighter variant
    const light = rgb.map((c) => Math.min(255, c + 80)) as AccentColor;
    document.documentElement.style.setProperty("--accent-light", `${light[0]} ${light[1]} ${light[2]}`);
  }, []);

  /* ── Note indicators set ── */
  const noteIndicators = useMemo<Set<string>>(() => {
    const s = new Set<string>();
    const mk = getMonthKey(currentDate);
    // Monthly note indicator on day 1
    if (notes.monthlyNotes[mk]?.trim()) {
      const d = parseDateKey(mk + "-01");
      if (d) s.add(formatDateKey(d));
    }
    // Range note indicators
    for (const note of notes.rangeNotes) {
      if (!note.text.trim()) continue;
      // Mark start date
      s.add(note.startKey);
    }
    return s;
  }, [notes, currentDate]);

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-500"
      style={{ background: "rgb(var(--bg))" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Page header */}
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1
            className="font-bold tracking-tight"
            style={{
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              color: "rgb(var(--text))",
              letterSpacing: "-0.03em",
            }}
          >
            📅 Wall Calendar
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgb(var(--text-muted))" }}>
            Plan your month beautifully
          </p>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-200"
          style={{
            background: "rgb(var(--surface-2))",
            color: "rgb(var(--text-muted))",
            border: "1px solid rgb(var(--border))",
          }}
        >
          GitHub ↗
        </a>
      </header>

      {/* Main card */}
      <main className="max-w-6xl mx-auto">
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgb(var(--surface))",
            border: "1px solid rgb(var(--border))",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-1.5 w-full"
            style={{ background: `linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-light)))` }}
          />

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Two-column layout on desktop */}
            <div className="calendar-layout">
              {/* LEFT: Hero image */}
              <div className="flex flex-col gap-4">
                <HeroImage currentDate={currentDate} onColorExtracted={handleColorExtracted} />

                {/* Stat chips */}
                <div className="grid grid-cols-2 gap-3">
                  <StatChip
                    label="Selected Range"
                    value={rangeStart && rangeEnd
                      ? `${format(rangeStart, "MMM d")} – ${format(rangeEnd, "MMM d")}`
                      : "None"}
                  />
                  <StatChip
                    label="Notes this month"
                    value={String(
                      notes.rangeNotes.filter((n) =>
                        getMonthKey(parseDateKey(n.startKey) ?? new Date()) === getMonthKey(currentDate)
                      ).length
                    )}
                  />
                </div>
              </div>

              {/* RIGHT: Calendar grid + notes */}
              <div className="flex flex-col gap-4">
                <div
                  className="rounded-2xl p-4 sm:p-5"
                  style={{
                    background: "rgb(var(--surface-2))",
                    border: "1px solid rgb(var(--border))",
                  }}
                >
                  <MonthNavigator
                    currentDate={currentDate}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onToday={goToToday}
                    darkMode={darkMode}
                    onToggleDark={toggleDark}
                  />

                  <RangePreview
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    hoverDate={hoverDate}
                    onClear={clearSelection}
                  />

                  <CalendarGrid
                    currentDate={currentDate}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    previewEnd={previewEnd}
                    noteIndicators={noteIndicators}
                    onDayMouseDown={handleDayMouseDown}
                    onDayMouseEnter={handleDayMouseEnter}
                    onDayMouseUp={handleDayMouseUp}
                    onDayClick={handleDayClick}
                    direction={direction}
                  />

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4"
                       style={{ borderTop: "1px solid rgb(var(--border))" }}>
                    <LegendItem color="rgb(var(--accent))" label="Today / Selected" />
                    <LegendItem color="rgb(var(--accent) / 0.2)" label="In range" />
                    <LegendItem color="#f59e0b" label="Holiday" />
                    <LegendItem color="rgb(var(--accent))" dot label="Has note" />
                  </div>
                </div>

                <NotesPanel
                  currentDate={currentDate}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  notes={notes}
                  onNotesChange={setNotes}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-3 flex items-center justify-between text-xs"
            style={{
              borderTop: "1px solid rgb(var(--border))",
              color: "rgb(var(--text-muted))",
              background: "rgb(var(--surface-2))",
            }}
          >
            <span>⌨️ Arrow keys to navigate · Enter to select · Esc to clear</span>
            <span>📱 Swipe to change month on mobile</span>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Helper sub-components ── */
function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "rgb(var(--surface-2))",
        border: "1px solid rgb(var(--border))",
      }}
    >
      <p className="text-xs text-muted mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-base truncate">{value}</p>
    </div>
  );
}

function LegendItem({ color, label, dot }: { color: string; label: string; dot?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      {dot ? (
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      ) : (
        <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
      )}
      {label}
    </div>
  );
}
