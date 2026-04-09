"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { format, isSameDay, isToday } from "date-fns";
import clsx from "clsx";
import { getHoliday } from "@/utils/holidays";
import { isInRange, isRangeStart, isRangeEnd } from "@/utils/dateHelpers";

interface DayCellProps {
  date: Date;
  isAdjacent: boolean;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  previewEnd: Date | null;
  hasNote: boolean;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: (date: Date) => void;
  onClick: (date: Date) => void;
  onKeyDown: (e: React.KeyboardEvent, date: Date) => void;
  tabIndex: number;
}

const DayCell = memo(function DayCell({
  date, isAdjacent, rangeStart, rangeEnd, previewEnd, hasNote,
  onMouseDown, onMouseEnter, onMouseUp, onClick, onKeyDown, tabIndex,
}: DayCellProps) {
  const holiday = getHoliday(date);
  const today = isToday(date);

  // Compute visual state using confirmed range or preview
  const effectiveEnd = rangeEnd ?? previewEnd;
  const inRange     = isInRange(date, rangeStart, effectiveEnd);
  const isStart     = isRangeStart(date, rangeStart, effectiveEnd);
  const isEnd       = isRangeEnd(date, rangeStart, effectiveEnd);

  const cellClass = clsx("day-cell", {
    "is-adjacent": isAdjacent,
    "is-today": today,
    "is-start": isStart,
    "is-end": isEnd,
    "is-in-range": inRange && !isStart && !isEnd,
    "is-holiday": !!holiday,
  });

  return (
    <motion.div
      className={cellClass}
      tabIndex={isAdjacent ? -1 : tabIndex}
      role="gridcell"
      aria-label={`${format(date, "MMMM d yyyy")}${holiday ? `, ${holiday.name}` : ""}${today ? ", today" : ""}`}
      aria-selected={isStart || isEnd || (inRange && !isAdjacent)}
      onMouseDown={() => !isAdjacent && onMouseDown(date)}
      onMouseEnter={() => onMouseEnter(date)}
      onMouseUp={() => !isAdjacent && onMouseUp(date)}
      onClick={() => !isAdjacent && onClick(date)}
      onKeyDown={(e) => !isAdjacent && onKeyDown(e, date)}
      whileHover={!isAdjacent ? { scale: 1.07 } : {}}
      whileTap={!isAdjacent ? { scale: 0.93 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        padding: "clamp(4px, 1.5vw, 8px)",
        minHeight: "clamp(36px, 8vw, 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 2,
        outline: "none",
      }}
    >
      {/* Day number */}
      <span
        className="day-num relative flex items-center justify-center font-semibold transition-all duration-200"
        style={{
          width: "clamp(24px, 6vw, 32px)",
          height: "clamp(24px, 6vw, 32px)",
          fontSize: "clamp(0.7rem, 2vw, 0.875rem)",
          color: (isStart || isEnd) ? "#fff" : today ? "#fff" : "rgb(var(--text))",
        }}
      >
        {format(date, "d")}
      </span>

      {/* Holiday emoji */}
      {holiday && (
        <span
          className="text-center leading-none"
          style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.75rem)" }}
          title={holiday.name}
        >
          {holiday.emoji}
        </span>
      )}

      {/* Note indicator dot */}
      {hasNote && !isAdjacent && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-1 h-1 rounded-full"
          style={{ background: "rgb(var(--accent))" }}
        />
      )}
    </motion.div>
  );
});

export default DayCell;
