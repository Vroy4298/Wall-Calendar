"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Trash2, StickyNote, Calendar, Plus, ChevronDown, ChevronUp } from "lucide-react";
import type { CalendarNotes, RangeNote } from "@/types/calendar";
import { getMonthKey, formatDateRange, parseDateKey } from "@/utils/dateHelpers";

interface NotesPanelProps {
  currentDate: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  notes: CalendarNotes;
  onNotesChange: (notes: CalendarNotes) => void;
}

export default function NotesPanel({
  currentDate, rangeStart, rangeEnd, notes, onNotesChange,
}: NotesPanelProps) {
  const monthKey = getMonthKey(currentDate);
  const [rangeOpen, setRangeOpen] = useState(true);

  /* ── Monthly note ── */
  const monthlyNote = notes.monthlyNotes[monthKey] ?? "";
  const handleMonthlyNote = (text: string) => {
    onNotesChange({
      ...notes,
      monthlyNotes: { ...notes.monthlyNotes, [monthKey]: text },
    });
  };

  /* ── Add range note ── */
  const canAddRangeNote = !!rangeStart && !!rangeEnd;
  const handleAddRangeNote = () => {
    if (!rangeStart || !rangeEnd) return;
    const startKey = format(rangeStart, "yyyy-MM-dd");
    const endKey = format(rangeEnd, "yyyy-MM-dd");
    const label = formatDateRange(rangeStart, rangeEnd);
    const newNote: RangeNote = {
      id: `${Date.now()}`,
      startKey,
      endKey,
      text: "",
      label: label ?? "",
    };
    onNotesChange({ ...notes, rangeNotes: [...notes.rangeNotes, newNote] });
  };

  /* ── Update range note text ── */
  const handleRangeNoteText = (id: string, text: string) => {
    onNotesChange({
      ...notes,
      rangeNotes: notes.rangeNotes.map((n) => (n.id === id ? { ...n, text } : n)),
    });
  };

  /* ── Delete range note ── */
  const handleDeleteRangeNote = (id: string) => {
    onNotesChange({
      ...notes,
      rangeNotes: notes.rangeNotes.filter((n) => n.id !== id),
    });
  };

  /* ── Filter range notes for current month ── */
  const currentMonthRangeNotes = notes.rangeNotes.filter((n) => {
    const d = parseDateKey(n.startKey);
    return d && getMonthKey(d) === monthKey;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgb(var(--surface))",
        border: "1px solid rgb(var(--border))",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-4"
        style={{
          borderBottom: "1px solid rgb(var(--border))",
          background: "rgb(var(--surface-2))",
        }}
      >
        <StickyNote size={16} style={{ color: "rgb(var(--accent))" }} />
        <h3 className="font-semibold text-sm text-base tracking-tight">
          Notes — {format(currentDate, "MMMM yyyy")}
        </h3>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Monthly note */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 block">
            Monthly memo
          </label>
          <motion.textarea
            value={monthlyNote}
            onChange={(e) => handleMonthlyNote(e.target.value)}
            placeholder={`General notes for ${format(currentDate, "MMMM")}…`}
            rows={3}
            className="w-full resize-none rounded-xl px-4 py-3 text-sm text-base transition-all duration-200 focus:outline-none"
            style={{
              background: "rgb(var(--surface-2))",
              border: "1px solid rgb(var(--border))",
              color: "rgb(var(--text))",
            }}
            whileFocus={{ boxShadow: "0 0 0 2px rgb(var(--accent) / 0.4)" }}
          />
        </div>

        {/* Range notes section */}
        <div>
          <div
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={() => setRangeOpen((o) => !o)}
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color: "rgb(var(--accent))" }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Range Notes ({currentMonthRangeNotes.length})
              </span>
            </div>
            {rangeOpen ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
          </div>

          <AnimatePresence initial={false}>
            {rangeOpen && (
              <motion.div
                key="range-notes"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden flex flex-col gap-3"
              >
                {/* Add range note button */}
                <motion.button
                  onClick={handleAddRangeNote}
                  disabled={!canAddRangeNote}
                  whileHover={canAddRangeNote ? { scale: 1.02 } : {}}
                  whileTap={canAddRangeNote ? { scale: 0.98 } : {}}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: canAddRangeNote ? "rgb(var(--accent) / 0.12)" : "rgb(var(--surface-2))",
                    color: canAddRangeNote ? "rgb(var(--accent))" : "rgb(var(--text-muted))",
                    border: `1px dashed ${canAddRangeNote ? "rgb(var(--accent) / 0.4)" : "rgb(var(--border))"}`,
                    cursor: canAddRangeNote ? "pointer" : "not-allowed",
                  }}
                >
                  <Plus size={14} />
                  {canAddRangeNote
                    ? `Add note for ${formatDateRange(rangeStart, rangeEnd)}`
                    : "Select a date range to add a note"}
                </motion.button>

                {/* Existing range notes */}
                <AnimatePresence>
                  {currentMonthRangeNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -10, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-xl overflow-hidden"
                      style={{
                        border: "1px solid rgb(var(--accent) / 0.25)",
                        background: "rgb(var(--accent) / 0.05)",
                      }}
                    >
                      {/* Note header */}
                      <div
                        className="flex items-center justify-between px-3 py-2"
                        style={{
                          background: "rgb(var(--accent) / 0.1)",
                          borderBottom: "1px solid rgb(var(--accent) / 0.15)",
                        }}
                      >
                        <span className="text-xs font-semibold" style={{ color: "rgb(var(--accent))" }}>
                          📅 {note.label}
                        </span>
                        <motion.button
                          onClick={() => handleDeleteRangeNote(note.id)}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-muted hover:text-red-400 transition-colors"
                          aria-label="Delete note"
                        >
                          <Trash2 size={13} />
                        </motion.button>
                      </div>
                      {/* Textarea */}
                      <textarea
                        value={note.text}
                        onChange={(e) => handleRangeNoteText(note.id, e.target.value)}
                        placeholder="Write your note here…"
                        rows={2}
                        className="w-full resize-none px-3 py-2 text-sm bg-transparent text-base focus:outline-none"
                        style={{ color: "rgb(var(--text))" }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {currentMonthRangeNotes.length === 0 && (
                  <p className="text-xs text-muted text-center py-2">
                    No range notes for this month yet.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
