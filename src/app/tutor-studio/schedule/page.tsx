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
  setMonth,
  setYear
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
      date: new Date(year, month, 2), 
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30" 
    },
    { 
      id: 2, 
      title: "Calculus II", 
      time: "2:00 PM", 
      date: new Date(year, month, 4), 
      color: "bg-teal-500/20 text-teal-300 border-teal-500/30" 
    },
    { 
      id: 3, 
      title: "Group Study", 
      time: "4:30 PM", 
      date: new Date(year, month, 4), 
      color: "bg-orange-500/20 text-orange-300 border-orange-500/30" 
    },
    { 
      id: 4, 
      title: "Physics 101", 
      time: "10:00 AM", 
      date: new Date(year, month, 7), 
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30" 
    },
    { 
      id: 5, 
      title: "Chemistry", 
      time: "1:00 PM", 
      date: new Date(year, month, 9), 
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30" 
    },
    { 
      id: 6, 
      title: "Calculus II", 
      time: "2:00 PM", 
      date: new Date(year, month, 11), 
      color: "bg-teal-500/20 text-teal-300 border-teal-500/30" 
    },
    { 
      id: 7, 
      title: "Physics 101", 
      time: "10:00 AM", 
      date: new Date(year, month, 14), 
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30" 
    },
    { 
      id: 8, 
      title: "Calculus II", 
      time: "2:00 PM", 
      date: new Date(year, month, 14), 
      color: "bg-teal-500/20 text-teal-300 border-teal-500/30" 
    },
    { 
      id: 9, 
      title: "Group Study", 
      time: "4:30 PM", 
      date: new Date(year, month, 16), 
      color: "bg-orange-500/20 text-orange-300 border-orange-500/30" 
    },
  ];
};

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const events = getMockEvents(currentDate);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Count sessions for "today" (using the mock data logic, let's say "today" is the 14th of the viewed month for demo purposes, or actual today)
  // For the UI "You have 4 sessions today", let's just mock it or calculate real events for today.
  const today = new Date();
  const todaysEvents = events.filter(event => isSameDay(event.date, today));
  
  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#15181E] p-6 rounded-2xl border border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {format(currentDate, "MMMM yyyy")}
          </h1>
          <p className="text-gray-400 text-sm">
            You have <span className="text-teal-400 font-bold">{todaysEvents.length} sessions</span> today.
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
              onClick={prevMonth}
              className="p-2 hover:bg-[#252b36] rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextMonth}
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

      {/* Calendar Grid */}
      <div className="flex-1 bg-[#15181E] rounded-2xl border border-gray-800 p-6 overflow-hidden flex flex-col">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-gray-500 text-sm font-bold uppercase tracking-wider pl-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 grid-rows-5 gap-4 flex-1">
          {calendarDays.map((day, dayIdx) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const dayEvents = events.filter(event => isSameDay(event.date, day));

            return (
              <div
                key={day.toString()}
                className={`
                  relative min-h-[120px] rounded-xl border p-3 transition-colors
                  ${isCurrentMonth ? "bg-[#0F1115]/50 border-gray-800/50" : "bg-[#0F1115]/20 border-transparent opacity-50"}
                  ${isToday ? "ring-1 ring-teal-500/50 bg-teal-500/5" : "hover:border-gray-700"}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`
                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday ? "bg-teal-500 text-black font-bold" : "text-gray-400"}
                  `}>
                    {format(day, "d")}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                      Today
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`
                        text-xs p-1.5 rounded-md border truncate
                        ${event.color}
                      `}
                    >
                      <div className="font-bold truncate">{event.title}</div>
                      <div className="opacity-80 text-[10px]">{event.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
