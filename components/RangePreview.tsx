"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatDateRange } from "@/utils/dateHelpers";
import { X } from "lucide-react";

interface RangePreviewProps {
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  onClear: () => void;
}

export default function RangePreview({ rangeStart, rangeEnd, hoverDate, onClear }: RangePreviewProps) {
  const effectiveEnd = rangeEnd ?? hoverDate;
  const visible = !!rangeStart;
  const label = formatDateRange(rangeStart, effectiveEnd);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl mb-4"
          style={{
            background: "rgb(var(--accent) / 0.12)",
            border: "1px solid rgb(var(--accent) / 0.3)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse-ring"
                  style={{ background: "rgb(var(--accent))" }} />
            <span className="text-sm font-medium" style={{ color: "rgb(var(--accent))" }}>
              {label || "Select an end date…"}
            </span>
          </div>

          {rangeEnd && (
            <motion.button
              onClick={onClear}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="text-muted hover:text-base transition-colors"
              aria-label="Clear selection"
            >
              <X size={15} />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
