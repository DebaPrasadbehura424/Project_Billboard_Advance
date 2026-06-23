import React, { useState } from "react";
import {
  Home,
  FileText,
  Users,
  CheckCircle,
  Bell,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { Button } from "../../components/Button";
import { useSuper } from "../../hooks/useSuper";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { reports, approvedFw, loading, error, refreshData } = useSuper();
  const navigate = useNavigate();
  console.log(reports);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<
    "home" | "reports" | "fieldworkers" | "verify"
  >("home");

  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "reports", label: "All Reports", icon: FileText },
    { id: "fieldworkers", label: "Field Workers", icon: Users },
    { id: "verify", label: "Sent for Verification", icon: CheckCircle },
  ];

  const handleViewReport = (reportId: any) => {
    navigate(`/admin_dash/report/${reportId}`);
  };

  // Status color helper
  const getStatusClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case "WORK_DONE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "RESPOND_TAKEN":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "ACTIVATED_BY_ADMIN":
      case "ACTIVATED_BY_DEPARTMENT":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "PASS_TO_WORKER":
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400";
      case "SEEN":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "RE_SUBMITTED":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

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
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nagrik NaZar</h1>
              <p className="text-xs text-indigo-600">Admin Portal</p>
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
                      ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium"
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
            className="w-full flex items-center justify-center gap-3 text-red-500 hover:text-red-600"
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
                <p className="font-medium text-sm">Admin Officer</p>
                <p className="text-xs text-gray-500">Bhubaneswar BMC</p>
              </div>
              <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-xl">
                👮
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* HOME */}
          {activePage === "home" && (
            <div className="max-w-7xl mx-auto space-y-8">
              <h1 className="text-4xl font-bold">Welcome back, Admin 👋</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Reports", value: reports.length, icon: "📋" },
                  {
                    label: "Pending",
                    value: reports.filter(
                      (r) => r.status?.toUpperCase() === "PENDING",
                    ).length,
                    icon: "⏳",
                  },
                  {
                    label: "In Progress",
                    value: reports.filter((r) =>
                      ["SEEN", "ACTIVATED_BY_ADMIN", "PASS_TO_WORKER"].includes(
                        r.status?.toUpperCase() || "",
                      ),
                    ).length,
                    icon: "🔄",
                  },
                  {
                    label: "Field Workers",
                    value: approvedFw.length,
                    icon: "👷",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow"
                  >
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <h3 className="text-4xl font-bold text-indigo-600">
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

          {/* ALL REPORTS - REAL DATA */}
          {activePage === "reports" && (
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">All Citizen Reports</h2>
                <Button onClick={refreshData} variant="secondary">
                  Refresh
                </Button>
              </div>

              {loading ? (
                <p className="text-center py-12 text-gray-500">
                  Loading reports...
                </p>
              ) : error ? (
                <p className="text-center py-12 text-red-500">{error}</p>
              ) : reports.length === 0 ? (
                <p className="text-center py-12 text-gray-500">
                  No reports available
                </p>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="p-6 text-left">Issue</th>
                        <th className="p-6 text-left">Citizen</th>
                        <th className="p-6 text-left">Location</th>
                        <th className="p-6 text-left">Risk</th>
                        <th className="p-6 text-left">Status</th>
                        <th className="p-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {reports.map((report) => (
                        <tr
                          key={report.reportId}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <td className="p-6">
                            <div className="font-medium">{report.category}</div>
                            <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                              {report.title || "No description"}
                            </div>
                          </td>
                          <td className="p-6">
                            {report.citizenName || "Unknown"}
                          </td>
                          <td className="p-6 text-gray-600 dark:text-gray-400">
                            {report.location}
                          </td>
                          <td className="p-6">
                            <span
                              className={`px-4 py-1 rounded-full text-xs font-medium ${
                                report.riskLevel === "High"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                              }`}
                            >
                              {report.riskLevel || "Medium"}
                            </span>
                          </td>
                          <td className="p-6">
                            <span
                              className={`px-4 py-1 rounded-full text-xs font-medium ${getStatusClass(report.status)}`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="p-6 text-center">
                            <button
                              onClick={() => handleViewReport(report.reportId)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition"
                            >
                              <Eye size={18} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* FIELD WORKERS */}
          {activePage === "fieldworkers" && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Field Workers</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedFw.map((worker) => (
                  <div
                    key={worker.id}
                    className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{worker.name}</h3>
                        <p className="text-gray-500">{worker.category}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs rounded-full self-start ${
                          worker.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : worker.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {worker.status}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      {worker.email} • {worker.phone}
                    </p>
                    <Button variant="primary" className="mt-6 w-full">
                      Assign Report
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VERIFY SECTION */}
          {activePage === "verify" && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Sent for Verification</h2>
              <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow text-center">
                <CheckCircle size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-2xl">No verification requests pending</p>
                <p className="text-gray-500 mt-2">
                  All reports are under process
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
