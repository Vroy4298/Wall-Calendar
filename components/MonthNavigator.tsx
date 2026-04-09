"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";

interface MonthNavigatorProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function MonthNavigator({
  currentDate, onPrev, onNext, onToday, darkMode, onToggleDark,
}: MonthNavigatorProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-5 px-1">
      {/* Month / Year */}
      <div className="flex items-center gap-3 flex-1">
        <motion.button
          onClick={onPrev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl border-base border surface hover:accent-bg-light transition-colors duration-200 text-base"
          style={{ borderWidth: 1, borderColor: "rgb(var(--border))" }}
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </motion.button>

        <motion.h1
          key={format(currentDate, "yyyy-MM")}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold tracking-tight text-base flex-1 text-center"
          style={{ letterSpacing: "-0.02em" }}
        >
          {format(currentDate, "MMMM yyyy")}
        </motion.h1>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl border-base border surface hover:accent-bg-light transition-colors duration-200 text-base"
          style={{ borderWidth: 1, borderColor: "rgb(var(--border))" }}
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={onToday}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="text-sm font-medium px-3 py-1.5 rounded-lg accent-bg-light accent-text transition-colors duration-200 hidden sm:flex items-center gap-1.5"
          aria-label="Go to today"
        >
          <CalendarDays size={14} />
          Today
        </motion.button>

        {/* Dark mode toggle */}
        <motion.button
          onClick={onToggleDark}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl border transition-colors duration-200 text-base"
          style={{ borderWidth: 1, borderColor: "rgb(var(--border))", background: "rgb(var(--surface-2))" }}
          aria-label="Toggle dark mode"
        >
          <motion.span
            key={darkMode ? "moon" : "sun"}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            className="text-base"
          >
            {darkMode ? "☀️" : "🌙"}
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}
