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
} from "lucide-react";
import { Button } from "../../components/Button";
import { useSuper } from "../../hooks/useSuper";
import HeatMap from "../public/HeatMap";
import axios from "axios";
import { ReportTable } from "../../components/ReportTable";

const AdminDashboard: React.FC = () => {
  const { reports, approvedFw, refreshData } = useSuper();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activePage, setActivePage] = useState<
    "home" | "reports" | "fieldworkers" | "verify" | "heatmap"
  >("home");

  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "reports", label: "All Reports", icon: FileText },
    { id: "fieldworkers", label: "Field Workers", icon: Users },
    { id: "verify", label: "Sent for Verification", icon: CheckCircle },
    { id: "heatmap", label: "HeatMap", icon: CheckCircle },
  ];

  const handleAssignReport = async (worker: any, report: any) => {
    if (!worker || !report) return;

    const payload = {
      workerId: worker.id,
      workerName: worker.name,
      reportId: report.reportId,
    };

    try {
      const res = await axios.patch(`/api/fw/assignReports`, payload);

      console.log("Report Assigned Successfully:", res.data);
      alert(`✅ Report assigned successfully to ${worker.name}`);

      // Refresh data after assignment
      refreshData();

      // Close modal
      setShowReportModal(false);
      setSelectedWorker(null);
    } catch (err) {}
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
              <h1 className="text-2xl font-bold text-white">Nagrik NaZar</h1>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-al ${
                    activePage === item.id
                      ? "bg-indigo-50 text-black  font-medium"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-white"
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

          <div className="flex items-center gap-4 text-white">
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

        {activePage === "heatmap" && <HeatMap />}

        <div className="flex-1 overflow-auto p-6">
          {/* HOME */}
          {activePage === "home" && (
            <div className="max-w-7xl mx-auto space-y-8">
              <h1 className="text-4xl font-bold text-white">
                Welcome back, Admin 👋
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Reports", value: reports.length, icon: "📋" },
                  {
                    label: "Pending",
                    value: reports.filter(
                      (r) => r.reportStatus?.toUpperCase() === "PENDING",
                    ).length,
                    icon: "⏳",
                  },
                  {
                    label: "In Progress",
                    value: reports.filter((r) =>
                      ["SEEN", "ACTIVATED_BY_ADMIN", "PASS_TO_WORKER"].includes(
                        r.reportStatus?.toUpperCase() || "",
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

          {/* ALL REPORTS */}
          {activePage === "reports" && (
            <ReportTable
              data={reports}
              liveCount={reports.length}
              formatDate={new Date().toLocaleDateString()}
            />
          )}

          {/* FIELD WORKERS */}
          {activePage === "fieldworkers" && (
            <div className="max-w-7xl mx-auto text-white">
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
                    <Button
                      variant="primary"
                      className="mt-6 w-full"
                      onClick={() => {
                        setSelectedWorker(worker);
                        setShowReportModal(true);
                      }}
                    >
                      Assign Report
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VERIFY SECTION */}
          {activePage === "verify" && (
            <div className="max-w-7xl mx-auto text-white">
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

      {/* Report Assignment Modal */}
      {showReportModal && selectedWorker && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Assign Report</h2>
                <p className="text-sm text-gray-500">
                  To: {selectedWorker.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedWorker(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Scrollable Reports List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
              {reports.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  No reports available to assign
                </p>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.reportId}
                    className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{report.category}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {report.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {report.location}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      onClick={() => handleAssignReport(selectedWorker, report)}
                    >
                      Assign
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedWorker(null);
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
