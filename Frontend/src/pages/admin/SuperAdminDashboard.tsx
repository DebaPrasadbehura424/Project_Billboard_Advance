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
  Eye,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SuperContext } from "../../context/SuperContext";
import axios from "axios";

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

          {/* PENDING APPROVALS */}
          {activeTab === "pending" && (
            <div className="space-y-10">
              <DataTablePending
                title="Pending Admin Applications"
                data={pendingAdmins}
                type="admin"
                onStatusUpdate={handleStatusUpdate}
                formatDate={formatDate}
              />
              <DataTablePending
                title="Pending Field Worker Applications"
                data={pendingFw}
                type="fw"
                onStatusUpdate={handleStatusUpdate}
                formatDate={formatDate}
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
              />
              <DataTable
                title="Rejected Field Workers"
                data={rejectedFw}
                type="fw"
                formatDate={formatDate}
                isRejected
              />
            </div>
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <ReportTable
              data={reports}
              liveCount={liveReports.length}
              formatDate={formatDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Quick Pending Card
const QuickPendingCard = ({ title, data, type, onApprove }: any) => (
  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
    <h3 className="text-xl font-semibold mb-5">{title}</h3>
    <div className="space-y-4">
      {data.slice(0, 4).map((item: any) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-gray-950 p-4 rounded-2xl"
        >
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-400">{item.email}</p>
          </div>
          <button
            onClick={() => onApprove(item.email, "APPROVED", type)}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-sm font-medium rounded-xl transition"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  </div>
);

// Reusable Data Table (Improved UI)
const DataTable = ({
  title,
  data,
  type,
  onStatusUpdate,
  formatDate,
  showAllStatus = false,
  isRejected = false,
}: any) => {
  function handleItem(item: any): void {
    const sessionData = {
      id: item.id,
      email: item.email,
      document: item.document,
      name: item.name,
      phone: item.phone,
      category: item.category,
    };

    sessionStorage.setItem("user", JSON.stringify(sessionData));
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center">
        <p className="text-gray-400 text-lg">No {title.toLowerCase()} found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-sm text-gray-400">
              <th className="py-5 px-6 text-left">Name</th>
              <th className="py-5 px-6 text-left">Email</th>
              <th className="py-5 px-6 text-left">Phone</th>
              <th className="py-5 px-6 text-left">Applied On</th>
              <th className="py-5 px-6 text-left">Status</th>
              <th className="py-5 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data
              .filter(
                (item: any) =>
                  item.status !== "PENDING" && item.adminStatus !== "PENDING",
              )
              .map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-950 transition">
                  <td className="py-5 px-6 font-medium">{item.name}</td>
                  <td className="py-5 px-6 text-gray-400">{item.email}</td>
                  <td className="py-5 px-6 text-gray-400">{item.phone}</td>
                  <td className="py-5 px-6 text-gray-400">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-medium ${
                        item.adminStatus === "APPROVED" ||
                        item.status === "APPROVED"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : item.adminStatus === "REJECTED" ||
                              item.status === "REJECTED"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {item.adminStatus || item.status || "PENDING"}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleItem(item)}
                        className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm rounded-xl flex items-center gap-1.5 transition"
                      >
                        <Eye size={16} /> View
                      </button>

                      {!isRejected &&
                        (showAllStatus ||
                          item.adminStatus === "PENDING" ||
                          item.status === "PENDING") && (
                          <>
                            <button
                              onClick={() =>
                                onStatusUpdate(item.email, "REJECTED", type)
                              }
                              className="px-5 py-1.5 bg-red-600 hover:bg-red-700 text-sm rounded-xl transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const DataTablePending = ({
  title,
  data,
  type,
  onStatusUpdate,
  formatDate,
  showAllStatus = false,
  isRejected = false,
}: any) => {
  if (data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center">
        <p className="text-gray-400 text-lg">No {title.toLowerCase()} found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-sm text-gray-400">
              <th className="py-5 px-6 text-left">Name</th>
              <th className="py-5 px-6 text-left">Email</th>
              <th className="py-5 px-6 text-left">Phone</th>
              <th className="py-5 px-6 text-left">Applied On</th>
              <th className="py-5 px-6 text-left">Status</th>
              <th className="py-5 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-950 transition">
                <td className="py-5 px-6 font-medium">{item.name}</td>
                <td className="py-5 px-6 text-gray-400">{item.email}</td>
                <td className="py-5 px-6 text-gray-400">{item.phone}</td>
                <td className="py-5 px-6 text-gray-400">
                  {formatDate(item.createdAt)}
                </td>
                <td className="py-5 px-6">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${
                      item.adminStatus === "APPROVED" ||
                      item.status === "APPROVED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : item.adminStatus === "REJECTED" ||
                            item.status === "REJECTED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {item.adminStatus || item.status || "PENDING"}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => alert(`Viewing details of ${item.name}`)}
                      className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Eye size={16} /> View
                    </button>

                    {!isRejected &&
                      (showAllStatus ||
                        item.adminStatus === "PENDING" ||
                        item.status === "PENDING") && (
                        <>
                          <button
                            onClick={() =>
                              onStatusUpdate(item.email, "APPROVED", type)
                            }
                            className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-sm rounded-xl transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              onStatusUpdate(item.email, "REJECTED", type)
                            }
                            className="px-5 py-1.5 bg-red-600 hover:bg-red-700 text-sm rounded-xl transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Report Table
const ReportTable = ({ data, liveCount, formatDate }: any) => (
  <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
      <h3 className="text-2xl font-bold">All Reports ({data.length})</h3>
      <p className="text-emerald-400 font-medium">
        Live Reports: <span className="font-bold">{liveCount}</span>
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800 text-sm text-gray-400">
            <th className="py-5 px-6 text-left">Report ID</th>
            <th className="py-5 px-6 text-left">Title</th>
            <th className="py-5 px-6 text-left">Location</th>
            <th className="py-5 px-6 text-left">Risk</th>
            <th className="py-5 px-6 text-left">Status</th>
            <th className="py-5 px-6 text-left">Reported On</th>
            <th className="py-5 px-6 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.map((report: any) => (
            <tr key={report.id} className="hover:bg-gray-950 transition">
              <td className="py-5 px-6 font-mono text-sm">{report.id}</td>
              <td className="py-5 px-6 font-medium">
                {report.title || report.category}
              </td>
              <td className="py-5 px-6 text-gray-400">{report.location}</td>
              <td className="py-5 px-6">
                <span
                  className={`px-4 py-1 rounded-full text-xs ${report.riskLevel === "High" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}
                >
                  {report.riskLevel}
                </span>
              </td>
              <td className="py-5 px-6">
                <span className="px-4 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                  {report.status}
                </span>
              </td>
              <td className="py-5 px-6 text-gray-400">
                {formatDate(report.createdAt)}
              </td>
              <td className="py-5 px-6 text-center">
                <button
                  onClick={() => alert(`Viewing report: ${report.title}`)}
                  className="px-5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm flex items-center gap-2 mx-auto"
                >
                  <Eye size={16} /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SuperAdminDashboard;
