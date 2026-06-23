import React, { useState } from "react";
import {
  Home,
  FileText,
  CheckCircle,
  DollarSign,
  Bell,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Camera,
  MapPin,
} from "lucide-react";
import { Button } from "../../components/Button";

const FwDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<
    "home" | "assigned" | "transactions" | "completed"
  >("home");

  // Dummy Data - Replace with real data from API / hook
  const assignedReports = [
    {
      id: "RPT-7842",
      title: "Garbage pile near park",
      location: "Bapuji Nagar, Bhubaneswar",
      priority: "High",
      date: "2026-06-04",
      image: "https://res.cloudinary.com/.../garbage.jpg",
    },
    {
      id: "RPT-7819",
      title: "Street light not working",
      location: "Unit-4 Market",
      priority: "Medium",
      date: "2026-06-03",
      image: "https://res.cloudinary.com/.../light.jpg",
    },
  ];

  const transactions = [
    {
      id: "TXN-001",
      amount: 450,
      date: "2026-06-04",
      report: "Garbage Clearance",
      status: "Paid",
    },
    {
      id: "TXN-002",
      amount: 300,
      date: "2026-06-02",
      report: "Pothole Repair",
      status: "Paid",
    },
    {
      id: "TXN-003",
      amount: 200,
      date: "2026-05-30",
      report: "Drain Cleaning",
      status: "Pending",
    },
  ];

  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "assigned", label: "Assigned Reports", icon: FileText },
    { id: "transactions", label: "My Earnings", icon: DollarSign },
    { id: "completed", label: "Completed Work", icon: CheckCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative w-72 bg-white dark:bg-gray-900 h-full shadow-xl z-50 transition-transform duration-300`}
      >
        <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nagrik NaZar</h1>
              <p className="text-xs text-emerald-600">Field Worker Portal</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${
                    activePage === item.id
                      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-6 w-full px-6">
          <Button
            variant="secondary"
            onClick={() => alert("Logged out!")}
            className="w-full flex items-center justify-center gap-3 text-red-500 hover:text-red-600 dark:text-red-400"
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm h-16 flex items-center px-6 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu size={26} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell size={22} />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l dark:border-gray-700">
              <div className="text-right">
                <p className="font-medium text-sm">Sanjay Das</p>
                <p className="text-xs text-gray-500">FW-004 • North Zone</p>
              </div>
              <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center text-xl">
                👷
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* ================== HOME DASHBOARD ================== */}
          {activePage === "home" && (
            <div className="max-w-7xl mx-auto space-y-8">
              <h1 className="text-4xl font-bold">
                Welcome back, Field Worker 👋
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Assigned Reports", value: "12", icon: "📋" },
                  { label: "Pending Action", value: "5", icon: "⏳" },
                  { label: "Resolved Today", value: "3", icon: "✅" },
                  { label: "Total Earned", value: "₹8,450", icon: "💰" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow"
                  >
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <h3 className="text-4xl font-bold text-emerald-600">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================== ASSIGNED REPORTS ================== */}
          {activePage === "assigned" && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Assigned Reports</h2>
              <div className="grid gap-6">
                {assignedReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 flex flex-col md:flex-row gap-6"
                  >
                    <div className="md:w-72 rounded-2xl overflow-hidden">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-full h-56 object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold">
                            {report.title}
                          </h3>
                          <span
                            className={`px-4 py-1 rounded-full text-sm font-medium ${
                              report.priority === "High"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                            }`}
                          >
                            {report.priority}
                          </span>
                        </div>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                          <MapPin size={16} /> {report.location}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={() => alert(`Taking action on ${report.id}`)}
                        >
                          <Camera size={18} />
                          Take Action & Upload Proof
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => alert("Mark as Completed")}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================== TRANSACTIONS / EARNINGS ================== */}
          {activePage === "transactions" && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                My Earnings & Transactions
              </h2>
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="p-6 text-left">Transaction ID</th>
                      <th className="p-6 text-left">Report</th>
                      <th className="p-6 text-left">Date</th>
                      <th className="p-6 text-left">Amount</th>
                      <th className="p-6 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {transactions.map((txn) => (
                      <tr
                        key={txn.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="p-6 font-medium">{txn.id}</td>
                        <td className="p-6">{txn.report}</td>
                        <td className="p-6 text-gray-600 dark:text-gray-400">
                          {txn.date}
                        </td>
                        <td className="p-6 font-semibold text-emerald-600">
                          ₹{txn.amount}
                        </td>
                        <td className="p-6">
                          <span
                            className={`px-4 py-1 rounded-full text-xs font-medium ${
                              txn.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================== COMPLETED WORK ================== */}
          {activePage === "completed" && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Completed Work</h2>
              <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow text-center">
                <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                <p className="text-2xl">
                  You have completed 47 reports this month
                </p>
                <p className="text-gray-500 mt-2">Great job! Keep it up.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FwDashboard;
