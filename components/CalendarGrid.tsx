"use client";

import { useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, getMonth, getYear, addDays, subDays } from "date-fns";
import { buildCalendarGrid, isAdjacentMonth, WEEKDAY_LABELS } from "@/utils/calendarHelpers";
import { formatDateKey } from "@/utils/dateHelpers";
import DayCell from "./DayCell";

interface CalendarGridProps {
  currentDate: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  previewEnd: Date | null;
  noteIndicators: Set<string>; // set of "yyyy-MM-dd" keys that have notes
  onDayMouseDown: (date: Date) => void;
  onDayMouseEnter: (date: Date) => void;
  onDayMouseUp: (date: Date) => void;
  onDayClick: (date: Date) => void;
  direction: number; // +1 forward, -1 backward (for slide animation)
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "30%" : "-30%",
    opacity: 0,
    scale: 0.97,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-30%" : "30%",
    opacity: 0,
    scale: 0.97,
  }),
};

export default function CalendarGrid({
  currentDate, rangeStart, rangeEnd, previewEnd, noteIndicators,
  onDayMouseDown, onDayMouseEnter, onDayMouseUp, onDayClick, direction,
}: CalendarGridProps) {
  const month = getMonth(currentDate);
  const year = getYear(currentDate);
  const gridDays = buildCalendarGrid(year, month);
  const monthKey = `${year}-${month}`;

  const focusedRef = useRef<Date>(new Date());

  const handleKeyDown = useCallback((e: React.KeyboardEvent, date: Date) => {
    let target: Date | null = null;
    switch (e.key) {
      case "ArrowRight":  target = addDays(date, 1);  break;
      case "ArrowLeft":   target = subDays(date, 1);  break;
      case "ArrowDown":   target = addDays(date, 7);  break;
      case "ArrowUp":     target = subDays(date, 7);  break;
      case "Enter":       onDayClick(date);            return;
      case "Escape":      /* handled in parent */       return;
      default: return;
    }
    if (target) {
      e.preventDefault();
      focusedRef.current = target;
      const key = formatDateKey(target);
      const el = document.querySelector<HTMLElement>(`[data-daykey="${key}"]`);
      el?.focus();
    }
  }, [onDayClick]);

  return (
    <div
      role="grid"
      aria-label={format(currentDate, "MMMM yyyy")}
      onMouseLeave={() => {/* handled in parent */}}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold tracking-wider uppercase py-2"
            style={{ color: "rgb(var(--text-muted))" }}
            aria-label={d}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Animated month grid */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={monthKey}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-7 gap-px"
            style={{ background: "rgb(var(--border))", borderRadius: 12, overflow: "hidden" }}
          >
            {gridDays.map((date, idx) => {
              const adjacent = isAdjacentMonth(date, month);
              const key = formatDateKey(date);
              return (
                <div
                  key={key}
                  data-daykey={key}
                  style={{ background: "rgb(var(--surface))" }}
                >
                  <DayCell
                    date={date}
                    isAdjacent={adjacent}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    previewEnd={previewEnd}
                    hasNote={noteIndicators.has(key)}
                    onMouseDown={onDayMouseDown}
                    onMouseEnter={onDayMouseEnter}
                    onMouseUp={onDayMouseUp}
                    onClick={onDayClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={idx === 0 ? 0 : -1}
                  />
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
