import React, { useState } from "react";
import {
  Home,
  FileText,
  PlusCircle,
  Award,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import Report from "./ReportBox";
import { Myreport } from "./MyReport";
import { Button } from "../../components/Button";
import { useCitizen } from "../../hooks/useCitizen";
import Profile from "../private/Profile";
import { useNavigate } from "react-router-dom";
import HeatMap from "../public/HeatMap";

const CitizenDashboard: React.FC = () => {
  const { user, reports } = useCitizen();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<
    "dashboard" | "myreports" | "report" | "rewards" | "profile" | "heatmap"
  >("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "myreports", label: "My Reports", icon: FileText },
    { id: "rewards", label: "Rewards", icon: Award },
    { id: "heatmap", label: "HeatMap", icon: Award },
    { id: "profile", label: "Profile", icon: Award },
  ];
  let navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative w-72 bg-white dark:bg-gray-900 h-full shadow-xl z-50 transition-transform duration-300`}
      >
        <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">Nagrik NaZar</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Citizen Portal
              </p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {/* Report New Issue Button - Using Custom Button Component */}
          <Button
            variant="primary"
            onClick={() => {
              setActivePage("report");
              setIsSidebarOpen(false);
            }}
            className="w-full py-4 flex items-center justify-center gap-3 mb-8 shadow-lg text-base"
          >
            <PlusCircle size={22} />
            Report New Issue
          </Button>

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
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium"
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
          {/* Logout Button - Using Custom Button Component */}
          <Button
            variant="secondary"
            onClick={() => {
              window.confirm("Are you sure for logout");
              sessionStorage.clear();
              navigate("/");
            }}
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

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l dark:border-gray-700">
              <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">
                <p className="font-medium text-sm text-white">{user?.name}</p>
                👨‍💼
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* ================== DASHBOARD HOME ================== */}
          {activePage === "dashboard" && (
            <div className="max-w-7xl mx-auto space-y-8">
              <div>
                <h1 className="text-4xl font-bold">
                  Welcome back, {user?.name} 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  You have made a great impact this month
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "Total Reports",
                    value: reports.length || 0,
                    icon: "📋",
                  },
                  { label: "Resolved", value: user?.Pending, icon: "✅" },
                  { label: "Pending", value: user?.Resolved, icon: "⏳" },
                  {
                    label: "Impact Score",
                    value: user?.ImapactScore,
                    icon: "🏆",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow"
                  >
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-semibold mt-8">Recent Reports</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Placeholder for development stage */}
                <p className="text-gray-500">
                  Recent reports will appear here...
                </p>
              </div>
            </div>
          )}

          {activePage === "myreports" && <Myreport />}

          {activePage === "report" && <Report />}
          {activePage === "profile" && <Profile />}
          {activePage === "heatmap" && <HeatMap />}

          {activePage === "rewards" && (
            <div className="max-w-4xl mx-auto text-center py-20">
              <h2 className="text-4xl font-bold mb-4">Rewards & Badges</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                This section is under development. More features coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
