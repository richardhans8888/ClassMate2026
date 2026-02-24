"use client";

import {
  Download,
  Calendar,
  DollarSign,
  Wallet,
  Clock,
  ArrowUpRight,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Mock Data
const transactions = [
  {
    id: 1,
    student: "Alex D.",
    subject: "Physics 101",
    amount: 45.0,
    time: "2h ago",
    avatar: "A",
  },
  {
    id: 2,
    student: "Sarah J.",
    subject: "Calculus II",
    amount: 60.0,
    time: "5h ago",
    avatar: "S",
  },
  {
    id: 3,
    student: "Mike K.",
    subject: "Chemistry",
    amount: 55.0,
    time: "Yesterday",
    avatar: "M",
  },
];

const earningsBySubject = [
  {
    subject: "Advanced Calculus",
    amount: 5240,
    percentage: 42,
    color: "bg-blue-600",
  },
  {
    subject: "Intro to Physics",
    amount: 3850,
    percentage: 31,
    color: "bg-teal-400",
  },
  {
    subject: "Creative Writing",
    amount: 2110,
    percentage: 17,
    color: "bg-purple-500",
  },
  { subject: "Other", amount: 1250, percentage: 10, color: "bg-gray-500" },
];

export default function EarningsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Financial Overview
          </h1>
          <p className="text-gray-400 text-sm">
            Track your earnings, manage payouts, and analyze performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#15181E] border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#1A1F26] transition-colors">
            <Calendar className="w-4 h-4" />
            Oct 1, 2023 - Oct 31, 2023
          </button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-[#15181E] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 text-blue-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +12.5%
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <h2 className="text-3xl font-bold text-white mb-1">$12,450.00</h2>
            <p className="text-xs text-gray-500">
              Compared to $11,066 last month
            </p>
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-[#15181E] p-6 rounded-2xl border border-gray-800 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-400">Next payout: Nov 1</span>
          </div>
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-1">Available Balance</p>
            <h2 className="text-3xl font-bold text-white">$840.00</h2>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6">
            Withdraw Funds <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Total Hours Taught */}
        <div className="bg-[#15181E] p-6 rounded-2xl border border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 text-purple-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +5.2%
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Hours Taught</p>
            <h2 className="text-3xl font-bold text-white mb-1">142.5 hrs</h2>
            <p className="text-xs text-gray-500">Avg. $87.36 / hour</p>
          </div>
        </div>
      </div>

      {/* Charts & Transactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Earnings Chart */}
        <div className="lg:col-span-2 bg-[#15181E] p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-white">Monthly Earnings</h3>
              <p className="text-xs text-gray-400 mt-1">
                Income trend over the last 6 months
              </p>
            </div>
            <div className="flex bg-[#0F1115] rounded-lg p-1 border border-gray-800">
              {["6M", "1Y", "ALL"].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    period === "6M"
                      ? "bg-[#1A1F26] text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Simple SVG Line Chart */}
          <div className="relative h-64 w-full">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-600">
              {[4, 3, 2, 1, 0].map((i) => (
                <div
                  key={i}
                  className="border-b border-gray-800/50 w-full h-0"
                ></div>
              ))}
            </div>

            {/* Chart Path */}
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,200 C50,190 100,210 150,180 C200,150 250,130 300,100 C350,70 400,90 450,110 C500,130 550,100 600,80 L600,250 L0,250 Z"
                fill="url(#gradientArea)"
              />
              <path
                d="M0,200 C50,190 100,210 150,180 C200,150 250,130 300,100 C350,70 400,90 450,110 C500,130 550,100 600,80"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Data Points */}
              <circle
                cx="150"
                cy="180"
                r="4"
                fill="#15181E"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <circle
                cx="300"
                cy="100"
                r="4"
                fill="#15181E"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <circle
                cx="450"
                cy="110"
                r="4"
                fill="#15181E"
                stroke="#3B82F6"
                strokeWidth="2"
              />

              {/* Tooltip Point */}
              <g transform="translate(600, 80)">
                <circle
                  cx="0"
                  cy="0"
                  r="5"
                  fill="#3B82F6"
                  className="animate-pulse"
                />
                <rect
                  x="-30"
                  y="-40"
                  width="60"
                  height="28"
                  rx="4"
                  fill="#3B82F6"
                />
                <text
                  x="0"
                  y="-22"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  $2,850
                </text>
                <path d="M-5,-13 L0,-8 L5,-13" fill="#3B82F6" />
              </g>
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-4 translate-y-full">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-[#15181E] rounded-2xl border border-gray-800 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h3 className="font-bold text-white">Transaction History</h3>
            <p className="text-xs text-gray-400 mt-1">
              Recent student payments
            </p>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2 hover:bg-[#1A1F26] rounded-xl transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 font-bold">
                    {tx.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {tx.student}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-800/50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                      {tx.subject}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">
                    +${tx.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">{tx.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-800">
            <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white py-2 transition-colors">
              View All Transactions <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Earnings by Subject */}
      <div className="bg-[#15181E] p-6 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-white">Earnings by Subject</h3>
            <p className="text-xs text-gray-400 mt-1">
              Top performing courses this month
            </p>
          </div>
          <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
            View details
          </button>
        </div>

        <div className="space-y-6">
          {earningsBySubject.map((item) => (
            <div key={item.subject}>
              <div className="flex justify-between items-center mb-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span className="font-medium text-white">{item.subject}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white">
                    ${item.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    / {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-[#0F1115] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
