"use client";

import { useState, useCallback } from "react";
import { addMonths, subMonths } from "date-fns";

export function useCalendar(initialDate?: Date) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate ?? new Date());

  const goNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const goPrevMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  return {
    currentDate,
    goNextMonth,
    goPrevMonth,
    goToToday,
    goToDate,
  };
}
