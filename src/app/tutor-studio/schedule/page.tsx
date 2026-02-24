"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  addWeeks,
  subWeeks,
  isSameWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock events generator relative to a date
const getMockEvents = (baseDate: Date) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  return [
    {
      id: 1,
      title: "Physics 101",
      time: "10:00 AM",
      duration: "1h",
      date: new Date(year, month, 2),
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: 2,
      title: "Calculus II",
      time: "2:00 PM",
      duration: "1.5h",
      date: new Date(year, month, 4),
      color: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
    {
      id: 3,
      title: "Group Study",
      time: "4:30 PM",
      duration: "2h",
      date: new Date(year, month, 4),
      color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    },
    {
      id: 4,
      title: "Physics 101",
      time: "10:00 AM",
      duration: "1h",
      date: new Date(year, month, 7),
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: 5,
      title: "Chemistry",
      time: "1:00 PM",
      duration: "1h",
      date: new Date(year, month, 9),
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    {
      id: 6,
      title: "Calculus II",
      time: "2:00 PM",
      duration: "1.5h",
      date: new Date(year, month, 11),
      color: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
    {
      id: 7,
      title: "Physics 101",
      time: "10:00 AM",
      duration: "1h",
      date: new Date(year, month, 14),
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: 8,
      title: "Calculus II",
      time: "2:00 PM",
      duration: "1.5h",
      date: new Date(year, month, 14),
      color: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
    {
      id: 9,
      title: "Group Study",
      time: "4:30 PM",
      duration: "2h",
      date: new Date(year, month, 16),
      color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    },
    // Add events for current day to ensure "Day View" has content for demo
    {
      id: 10,
      title: "Demo Session",
      time: "9:00 AM",
      duration: "1h",
      date: new Date(),
      color: "bg-green-500/20 text-green-300 border-green-500/30",
    },
  ];
};

type EventItem = {
  id: number;
  title: string;
  time: string;
  duration: string;
  date: Date;
  color: string;
};

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTime, setDraftTime] = useState("10:00");
  const [draftColor, setDraftColor] = useState<
    "teal" | "purple" | "orange" | "blue" | "green"
  >("teal");
  const [userEvents, setUserEvents] = useState<EventItem[]>([]);

  // Navigation Logic
  const next = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const prev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, -1));
  };

  // Date Generation Logic
  let calendarDays: Date[] = [];
  let gridClass = "";

  if (view === "month") {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    gridClass = "grid grid-cols-7 grid-rows-5 gap-4";
  } else if (view === "week") {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    gridClass = "grid grid-cols-7 gap-4 h-full";
  } else {
    // Day view
    calendarDays = [currentDate];
    gridClass = "grid grid-cols-1 gap-4 h-full";
  }

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const events = [...getMockEvents(currentDate), ...userEvents];

  // Today's stats
  const today = new Date();
  const todaysEvents = events.filter((event) => isSameDay(event.date, today));

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#15181E] p-6 rounded-2xl border border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {view === "day"
              ? format(currentDate, "MMMM d, yyyy")
              : format(currentDate, "MMMM yyyy")}
          </h1>
          <p className="text-gray-400 text-sm">
            You have{" "}
            <span className="text-teal-400 font-bold">
              {todaysEvents.length} sessions
            </span>{" "}
            today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#0F1115] rounded-lg p-1 border border-gray-800">
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === v
                    ? "bg-teal-500/20 text-teal-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-2 hover:bg-[#252b36] rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="p-2 hover:bg-[#252b36] rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <Button className="bg-teal-500 hover:bg-teal-600 text-black font-bold">
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="flex-1 bg-[#15181E] rounded-2xl border border-gray-800 p-6 overflow-hidden flex flex-col">
        {/* Weekday Headers (Only for Month/Week views) */}
        {view !== "day" && (
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-gray-500 text-sm font-bold uppercase tracking-wider pl-2"
              >
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Days Grid */}
        <div className={`${gridClass} flex-1`}>
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentDate); // Only relevant for month view styling
            const isToday = isSameDay(day, new Date());
            const dayEvents = events.filter((event) =>
              isSameDay(event.date, day),
            );

            return (
              <div
                key={day.toString()}
                className={`
                  relative rounded-xl border p-3 transition-colors flex flex-col
                  ${view === "month" ? "min-h-[120px]" : "h-full"}
                  ${view === "month" && !isCurrentMonth ? "bg-[#0F1115]/20 border-transparent opacity-50" : "bg-[#0F1115]/50 border-gray-800/50"}
                  ${isToday ? "ring-1 ring-teal-500/50 bg-teal-500/5" : "hover:border-gray-700"}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDay(day);
                }}
              >
                {/* Date Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                      text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                      ${isToday ? "bg-teal-500 text-black font-bold" : "text-gray-400"}
                    `}
                    >
                      {format(day, "d")}
                    </span>
                    {view === "day" && (
                      <span className="text-lg font-bold text-white">
                        {format(day, "EEEE")}
                      </span>
                    )}
                  </div>
                  {isToday && (
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                      Today
                    </span>
                  )}
                </div>

                {/* Events List */}
                <div className={`space-y-1.5 ${view === "day" ? "mt-4" : ""}`}>
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`
                        rounded-md border truncate
                        ${event.color}
                        ${view === "day" ? "p-4 flex items-center justify-between" : "p-1.5 text-xs"}
                      `}
                    >
                      <div>
                        <div
                          className={`${view === "day" ? "text-lg font-bold" : "font-bold truncate"}`}
                        >
                          {event.title}
                        </div>
                        <div
                          className={`opacity-80 ${view === "day" ? "text-sm flex items-center gap-2 mt-1" : "text-[10px]"}`}
                        >
                          {view === "day" && <Clock className="w-4 h-4" />}
                          {event.time} {view === "day" && `(${event.duration})`}
                        </div>
                      </div>

                      {view === "day" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-white/10"
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  ))}

                  {dayEvents.length === 0 && view === "day" && (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                      <Clock className="w-8 h-8 mb-2 opacity-50" />
                      <p>No sessions scheduled</p>
                    </div>
                  )}
                </div>

                {selectedDay && isSameDay(selectedDay, day) && (
                  <div
                    className="absolute top-10 right-3 z-20 w-60 bg-[#0F1115] border border-gray-800 rounded-xl shadow-xl p-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-xs font-semibold text-gray-400 mb-2">
                      New Event • {format(selectedDay, "MMM d")}
                    </div>
                    <div className="space-y-2">
                      <input
                        className="w-full bg-[#15181E] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="Title"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Time</span>
                        <input
                          type="time"
                          className="bg-[#15181E] border border-gray-800 rounded-lg px-2 py-1 text-sm text-white"
                          value={draftTime}
                          onChange={(e) => setDraftTime(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Color</span>
                        {[
                          { key: "teal", cls: "bg-teal-500" },
                          { key: "purple", cls: "bg-purple-500" },
                          { key: "orange", cls: "bg-orange-500" },
                          { key: "blue", cls: "bg-blue-500" },
                          { key: "green", cls: "bg-green-500" },
                        ].map((c) => (
                          <button
                            key={c.key}
                            className={`w-5 h-5 rounded ${c.cls} ${draftColor === c.key ? "ring-2 ring-white/50" : ""}`}
                            onClick={() => setDraftColor(c.key as any)}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDay(null);
                            setDraftTitle("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!selectedDay) return;
                            const colorMap = {
                              teal: "bg-teal-500/20 text-teal-300 border-teal-500/30",
                              purple:
                                "bg-purple-500/20 text-purple-300 border-purple-500/30",
                              orange:
                                "bg-orange-500/20 text-orange-300 border-orange-500/30",
                              blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                              green:
                                "bg-green-500/20 text-green-300 border-green-500/30",
                            } as const;
                            setUserEvents((prev) => [
                              ...prev,
                              {
                                id: Date.now(),
                                title: draftTitle || "Untitled",
                                time: format(selectedDay, "h:mm aa"),
                                duration: "1h",
                                date: selectedDay,
                                color: colorMap[draftColor],
                              },
                            ]);
                            setSelectedDay(null);
                            setDraftTitle("");
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
