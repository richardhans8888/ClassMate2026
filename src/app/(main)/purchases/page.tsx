"use client";

import { Button } from "@/components/ui/Button";
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const transactions = [
  {
    id: "TRX-2024-001",
    date: "Feb 15, 2024",
    item: "Premium Plan (Monthly)",
    amount: "$9.99",
    status: "Completed",
    method: "Visa ending in 4242",
  },
  {
    id: "TRX-2024-002",
    date: "Jan 15, 2024",
    item: "Premium Plan (Monthly)",
    amount: "$9.99",
    status: "Completed",
    method: "Visa ending in 4242",
  },
  {
    id: "TRX-2023-089",
    date: "Dec 15, 2023",
    item: "Premium Plan (Monthly)",
    amount: "$9.99",
    status: "Completed",
    method: "Visa ending in 4242",
  },
  {
    id: "TRX-2023-085",
    date: "Nov 28, 2023",
    item: "1-on-1 Tutoring: Calculus II",
    amount: "$45.00",
    status: "Completed",
    method: "PayPal",
  },
  {
    id: "TRX-2023-072",
    date: "Nov 15, 2023",
    item: "Premium Plan (Monthly)",
    amount: "$9.99",
    status: "Completed",
    method: "Visa ending in 4242",
  },
];

export default function PurchasesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#05050A] text-gray-900 dark:text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Purchase History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            View and manage your transactions and memberships.
          </p>
        </div>

        {/* Current Membership Card */}
        <div className="bg-white dark:bg-[#0F1117] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">Current Membership</h2>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                  PREMIUM
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Next billing date:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  March 15, 2024
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/10"
              >
                Cancel Plan
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                Manage Subscription
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-[#0F1117] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-500" />
              Transactions
            </h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-[#1E2028] text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {transactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {trx.item}
                      <div className="text-xs text-gray-500 dark:text-gray-500 font-normal mt-0.5">
                        {trx.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {trx.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {trx.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {trx.method}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
