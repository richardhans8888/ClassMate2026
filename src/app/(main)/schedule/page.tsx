"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EventItem = {
  id: string;
  date: string;
  title: string;
  time?: string;
  color: string;
};

export default function MySchedulePage() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: "1",
      date: toISO(current.year, current.month, 10),
      title: "Calculus II Study",
      time: "4:00 PM",
      color: "bg-blue-500",
    },
    {
      id: "2",
      date: toISO(current.year, current.month, 12),
      title: "Physics Review",
      time: "10:00 AM",
      color: "bg-emerald-500",
    },
    {
      id: "3",
      date: toISO(current.year, current.month, 17),
      title: "Project Meeting",
      time: "2:30 PM",
      color: "bg-purple-500",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("bg-blue-500");

  const monthMatrix = useMemo(
    () => buildMonthMatrix(current.year, current.month),
    [current],
  );
  const monthLabel = useMemo(
    () =>
      new Date(current.year, current.month, 1).toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      }),
    [current],
  );

  function openNew(dateISO: string) {
    setDraftDate(dateISO);
    setTitle("");
    setTime("");
    setColor("bg-blue-500");
    setOpen(true);
  }

  function saveEvent() {
    if (!draftDate || !title.trim()) {
      setOpen(false);
      return;
    }
    const id = Math.random().toString(36).slice(2);
    setEvents((prev) => [
      ...prev,
      { id, date: draftDate, title: title.trim(), time: time.trim(), color },
    ]);
    setOpen(false);
  }

  function prevMonth() {
    setCurrent((c) => {
      const m = c.month - 1;
      return m < 0
        ? { year: c.year - 1, month: 11 }
        : { year: c.year, month: m };
    });
  }
  function nextMonth() {
    setCurrent((c) => {
      const m = c.month + 1;
      return m > 11
        ? { year: c.year + 1, month: 0 }
        : { year: c.year, month: m };
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                My Schedule
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {monthLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() =>
                openNew(
                  toISO(current.year, current.month, new Date().getDate()),
                )
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((d) => (
            <div
              key={d}
              className="text-xs text-center text-gray-500 dark:text-gray-400"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {monthMatrix.map((cell) => {
            const dateISO = toISO(cell.year, cell.month, cell.day);
            const cellEvents = events.filter((e) => e.date === dateISO);
            const inCurrent =
              cell.month === current.month && cell.year === current.year;
            return (
              <button
                key={dateISO}
                onClick={() => openNew(dateISO)}
                className={`h-28 rounded-xl border p-2 text-left transition-colors ${
                  inCurrent
                    ? "bg-white dark:bg-[#0F1117] border-gray-200 dark:border-gray-800 hover:border-blue-500"
                    : "bg-gray-100 dark:bg-[#0D1320] border-gray-200 dark:border-gray-800 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`text-xs font-medium ${inCurrent ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}
                  >
                    {cell.day}
                  </div>
                  <div className="flex gap-1">
                    {cellEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className={`inline-block w-2 h-2 rounded-full ${e.color}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  {cellEvents.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className={`text-[11px] px-2 py-1 rounded ${e.color} text-white`}
                    >
                      {e.title} {e.time ? `• ${e.time}` : ""}
                    </div>
                  ))}
                  {cellEvents.length > 3 && (
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      +{cellEvents.length - 3} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Upcoming
          </h2>
          <div className="space-y-3">
            {events
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between bg-white dark:bg-[#0F1117] border border-gray-200 dark:border-gray-800 rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-6 rounded ${e.color}`} />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {e.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(e.date).toLocaleDateString()} {e.time}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              ))}
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white dark:bg-[#0F1117] border border-gray-200 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle>Add Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {draftDate ? new Date(draftDate).toDateString() : ""}
              </div>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#15181E] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <input
                placeholder="Time (e.g. 4:00 PM)"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#15181E] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <div className="flex items-center gap-2">
                {[
                  "bg-blue-500",
                  "bg-emerald-500",
                  "bg-purple-500",
                  "bg-amber-500",
                  "bg-rose-500",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded ${c} ${color === c ? "ring-2 ring-offset-2 ring-blue-400 ring-offset-white dark:ring-offset-[#0F1117]" : ""}`}
                    aria-label={c}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveEvent}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function toISO(year: number, month: number, day: number) {
  const d = new Date(year, month, day);
  const iso = new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),
  ).toISOString();
  return iso.slice(0, 10);
}

function buildMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells = 42;
  const matrix: { year: number; month: number; day: number }[] = [];
  for (let i = 0; i < cells; i++) {
    const idx = i - startDow + 1;
    if (idx <= 0) {
      const day = prevMonthDays + idx;
      const pm = month - 1 < 0 ? 11 : month - 1;
      const py = month - 1 < 0 ? year - 1 : year;
      matrix.push({ year: py, month: pm, day });
    } else if (idx > daysInMonth) {
      const day = idx - daysInMonth;
      const nm = month + 1 > 11 ? 0 : month + 1;
      const ny = month + 1 > 11 ? year + 1 : year;
      matrix.push({ year: ny, month: nm, day });
    } else {
      matrix.push({ year, month, day: idx });
    }
  }
  return matrix;
}
