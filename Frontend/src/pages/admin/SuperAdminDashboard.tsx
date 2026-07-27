import React, { useState, useContext } from "react";
import {
  ShieldCheck,
  Users,
  FileText,
  UserCheck,
  LogOut,
  Menu,
  X,
  Bell,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SuperContext } from "../../context/SuperContext";
import axios from "axios";
import { ReportTable } from "../../components/ReportTable";
import { DataTable } from "../../components/DataTable";
import { DataTablePending } from "../../components/DataTablePending";
import { QuickPendingCard } from "../../components/QuickPendingCard";

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "pending" | "admins" | "fieldworkers" | "rejected" | "reports"
  >("overview");

  const {
    admins,
    pendingAdmins,
    approvedAdmins,
    rejectedAdmins,

    reports,
    liveReports,

    fieldWorkers,
    pendingFw,
    approvedFw,
    rejectedFw,

    loading,
    error,
    refreshData,
  } = useContext(SuperContext)!;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/superadmin");
  };

  const handleStatusUpdate = async (
    email: string,
    status: "APPROVED" | "REJECTED",
    type: "admin" | "fw",
  ) => {
    try {
      const endpoint =
        type === "admin"
          ? "http://localhost:8080/api/admins/status_update"
          : "http://localhost:8080/api/fw/status_update";

      const res = await axios.patch(endpoint, { email, status });
      alert(res.data?.message || "Status updated successfully!");
      refreshData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (dateString?: string) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";
  };
  {
    console.log(pendingAdmins);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex overflow-hidden">
      {/* Sidebar - Improved */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 transition-all duration-300`}
      >
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nagrik NaZar</h1>
            <p className="text-xs text-violet-400">Super Admin</p>
          </div>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            {[
              { label: "Overview", tab: "overview", icon: ShieldCheck },
              { label: "Pending Approvals", tab: "pending", icon: UserCheck },
              { label: "All Admins", tab: "admins", icon: Users },
              { label: "Field Workers", tab: "fieldworkers", icon: Users },
              { label: "Rejected", tab: "rejected", icon: UserX },
              { label: "All Reports", tab: "reports", icon: FileText },
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab as any);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                  activeTab === item.tab
                    ? "bg-violet-600 text-white shadow-md"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-8 w-full px-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-2xl transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-800"
            >
              {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <h2 className="text-2xl font-semibold capitalize tracking-tight">
              {activeTab.replace(/([A-Z])/g, " $1")}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search users or reports..."
                className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-2.5 w-80 focus:outline-none focus:border-violet-500 placeholder:text-gray-500"
              />
            </div>
            <button className="p-3 hover:bg-gray-800 rounded-2xl relative transition">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-900"></span>
            </button>
            <div className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center font-bold text-sm">
              SA
            </div>
          </div>
        </nav>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {loading && (
            <p className="text-center py-20 text-lg text-gray-400">
              Loading dashboard data...
            </p>
          )}
          {error && <p className="text-red-500 text-center py-10">{error}</p>}

          {/* OVERVIEW */}
          {activeTab === "overview" && !loading && (
            <div className="space-y-8">
              {/* Stats Cards - Enhanced */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Admins",
                    value: approvedAdmins.length,
                    color: "violet",
                  },
                  {
                    title: "Pending Admins",
                    value: pendingAdmins.length,
                    color: "amber",
                  },
                  {
                    title: "Total Field Workers",
                    value: approvedFw.length,
                    color: "emerald",
                  },
                  {
                    title: "Total Reports",
                    value: reports.length,
                    color: "sky",
                  },
                  {
                    title: "Rejected Admins",
                    value: rejectedAdmins.length,
                    color: "red",
                  },
                  {
                    title: "Rejected Field Workers",
                    value: rejectedFw.length,
                    color: "red",
                  },
                  {
                    title: "Live Reports",
                    value: liveReports.length,
                    color: "teal",
                  },
                  {
                    title: "Solved Reports",
                    value: liveReports.length,
                    color: "teal",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-violet-500 transition-all duration-300"
                  >
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-5xl font-bold mt-3 text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Action Cards */}
              <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {/* Pending Admins */}
                <QuickPendingCard
                  title="Pending Admins"
                  data={pendingAdmins}
                  type="admin"
                  onApprove={handleStatusUpdate}
                />

                {/* Pending Field Workers */}
                <QuickPendingCard
                  title="Pending Field Workers"
                  data={pendingFw}
                  type="fw"
                  onApprove={handleStatusUpdate}
                />
              </div>
            </div>
          )}

          {activeTab === "pending" && (
            <div className="space-y-10">
              <DataTablePending
                title="Pending Admin Applications"
                data={pendingAdmins}
                type="admin"
                onStatusUpdate={handleStatusUpdate}
                formatDate={formatDate}
                userProfile={"/adminprofile"}
              />
              <DataTablePending
                title="Pending Field Worker Applications"
                data={pendingFw}
                type="fw"
                onStatusUpdate={handleStatusUpdate}
                formatDate={formatDate}
                userProfile={"/fwprofile"}
              />
            </div>
          )}

          {/* ALL ADMINS */}
          {activeTab === "admins" && (
            <DataTable
              title="All Admins"
              data={admins}
              type="admin"
              onStatusUpdate={handleStatusUpdate}
              formatDate={formatDate}
              showAllStatus
              userProfile={"/adminprofile"}
            />
          )}

          {/* FIELD WORKERS */}
          {activeTab === "fieldworkers" && (
            <DataTable
              title="All Field Workers"
              data={fieldWorkers}
              type="fw"
              onStatusUpdate={handleStatusUpdate}
              formatDate={formatDate}
              showAllStatus
              userProfile={"/fwprofile"}
            />
          )}

          {/* REJECTED */}
          {activeTab === "rejected" && (
            <div className="space-y-10">
              <DataTable
                title="Rejected Admins"
                data={rejectedAdmins}
                type="admin"
                formatDate={formatDate}
                isRejected
                userProfile={"/adminprofile"}
              />
              <DataTable
                title="Rejected Field Workers"
                data={rejectedFw}
                type="fw"
                formatDate={formatDate}
                isRejected
                userProfile={"/fwprofile"}
              />
            </div>
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <ReportTable
              data={reports}
              liveCount={liveReports.length}
              formatDate={new Date().toLocaleDateString()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
