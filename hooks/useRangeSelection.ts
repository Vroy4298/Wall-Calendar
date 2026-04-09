"use client";

import { useState, useCallback, useRef } from "react";
import { isBefore } from "date-fns";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export function useRangeSelection() {
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const isDragging = useRef(false);
  const awaitingSecondClick = useRef(false);

  const handleDayMouseDown = useCallback((date: Date) => {
    // Start a new drag/selection
    isDragging.current = true;
    awaitingSecondClick.current = false;
    setRangeStart(date);
    setRangeEnd(null);
    setHoverDate(date);
  }, []);

  const handleDayMouseEnter = useCallback((date: Date) => {
    setHoverDate(date);
    if (isDragging.current) {
      setRangeEnd(date);
    }
  }, []);

  const handleDayMouseUp = useCallback((date: Date) => {
    if (isDragging.current) {
      isDragging.current = false;
      setRangeEnd(date);

      // If start === end (single click), wait for a second click
      if (rangeStart && isSameDay(rangeStart, date)) {
        awaitingSecondClick.current = true;
        setRangeEnd(null);
      }
    }
  }, [rangeStart]);

  const handleDayClick = useCallback((date: Date) => {
    if (awaitingSecondClick.current) {
      // Second click sets the end date
      awaitingSecondClick.current = false;
      setRangeEnd(date);

      // Swap if needed
      if (rangeStart && isBefore(date, rangeStart)) {
        setRangeStart(date);
        setRangeEnd(rangeStart);
      }
    } else {
      // First click: start fresh
      awaitingSecondClick.current = true;
      setRangeStart(date);
      setRangeEnd(null);
    }
  }, [rangeStart]);

  const clearSelection = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
    setHoverDate(null);
    isDragging.current = false;
    awaitingSecondClick.current = false;
  }, []);

  // Normalise: ensure start <= end
  const normalisedStart =
    rangeStart && rangeEnd
      ? isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd
      : rangeStart;
  const normalisedEnd =
    rangeStart && rangeEnd
      ? isBefore(rangeStart, rangeEnd) ? rangeEnd : rangeStart
      : null;

  // Hover-preview end: show when start is set but end is not
  const previewEnd = !rangeEnd && hoverDate ? hoverDate : null;

  return {
    rangeStart: normalisedStart,
    rangeEnd: normalisedEnd,
    hoverDate,
    previewEnd,
    handleDayMouseDown,
    handleDayMouseEnter,
    handleDayMouseUp,
    handleDayClick,
    clearSelection,
  };
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
