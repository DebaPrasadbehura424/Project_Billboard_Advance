import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Report {
  id?: string | number;
  reportId?: string | number;
  title?: string;
  lat?: number | string;
  lng?: number | string;
  riskLevel?: string;
  riskPercentage?: number | string;
  status?: string;
  reportStatus?: string;
  createdAt?: string | Date;
  reportedOn?: string | Date;
}

interface ReportTableProps {
  data: Report[];
  liveCount: number;
  formatDate: string;
}

export const ReportTable = ({
  data,
  liveCount,
  formatDate,
}: ReportTableProps) => {
  const navigate = useNavigate();

  const handleViewReport = (reportId: string | number | undefined) => {
    if (!reportId) return;
    navigate(`/admin_dash/report/${reportId}`);
  };

  const getRiskBadgeClass = (level?: string, percentage?: number | string) => {
    const pct = Number(percentage);
    if (level === "High" || pct > 80) {
      return "bg-red-500/20 text-red-400";
    }
    if (level === "Medium" || (pct > 40 && pct <= 80)) {
      return "bg-amber-500/20 text-amber-400";
    }
    return "bg-emerald-500/20 text-emerald-400";
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h3 className="text-xl sm:text-2xl font-bold">
          All Reports ({data.length})
        </h3>
        <p className="text-emerald-400 font-medium text-sm sm:text-base">
          Live Reports: <span className="font-bold">{liveCount}</span>
        </p>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-200">
          <thead>
            <tr className="border-b border-gray-800 text-sm text-gray-400">
              <th className="py-4 px-4 lg:px-6 text-left">Report ID</th>
              <th className="py-4 px-4 lg:px-6 text-left">Title</th>
              <th className="py-4 px-4 lg:px-6 text-left">Location</th>
              <th className="py-4 px-4 lg:px-6 text-left">Risk Level</th>
              <th className="py-4 px-4 lg:px-6 text-left">Risk %</th>
              <th className="py-4 px-4 lg:px-6 text-left">Status</th>
              <th className="py-4 px-4 lg:px-6 text-left">Reported On</th>
              <th className="py-4 px-4 lg:px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.map((report) => {
              const id = report.id ?? report.reportId;
              const status = report.status ?? report.reportStatus ?? "Unknown";

              return (
                <tr key={id} className="hover:bg-gray-950/80 transition">
                  <td className="py-4 px-4 lg:px-6 font-mono text-sm text-gray-300">
                    {id ?? "—"}
                  </td>
                  <td className="py-4 px-4 lg:px-6 font-medium">
                    {report.title || "Not Given"}
                  </td>
                  <td className="py-4 px-4 lg:px-6 text-gray-400 text-sm">
                    {report.lat != null && report.lng != null
                      ? `${report.lat}, ${report.lng}`
                      : "—"}
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeClass(
                        report.riskLevel,
                        report.riskPercentage,
                      )}`}
                    >
                      {report.riskLevel || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeClass(
                        report.riskLevel,
                        report.riskPercentage,
                      )}`}
                    >
                      {report.riskPercentage != null
                        ? `${report.riskPercentage}%`
                        : "—"}
                    </span>
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      {status}
                    </span>
                  </td>
                  <td className="py-4 px-4 lg:px-6 text-gray-400 text-sm">
                    {formatDate}
                  </td>
                  <td className="py-4 px-4 lg:px-6 text-center">
                    <button
                      onClick={() => handleViewReport(id)}
                      className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm flex items-center gap-2 mx-auto transition"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden divide-y divide-gray-800">
        {data.map((report) => {
          const id = report.id ?? report.reportId;
          const status = report.status ?? report.reportStatus ?? "Unknown";

          return (
            <div key={id} className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-mono text-xs text-gray-500">#{id}</p>
                  <h4 className="font-semibold text-base mt-0.5">
                    {report.title || "Not Given"}
                  </h4>
                </div>
                <button
                  onClick={() => handleViewReport(id)}
                  className="shrink-0 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm flex items-center gap-1.5 transition"
                >
                  <Eye size={14} />
                  View
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Location</p>
                  <p className="text-gray-300">
                    {report.lat != null && report.lng != null
                      ? `${report.lat}, ${report.lng}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Reported On</p>
                  <p className="text-gray-300">{formatDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Risk Level</p>
                  <span
                    className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeClass(
                      report.riskLevel,
                      report.riskPercentage,
                    )}`}
                  >
                    {report.riskLevel || "—"}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Risk %</p>
                  <span
                    className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeClass(
                      report.riskLevel,
                      report.riskPercentage,
                    )}`}
                  >
                    {report.riskPercentage != null
                      ? `${report.riskPercentage}%`
                      : "—"}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs">Status</p>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    {status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="py-16 text-center text-gray-500">No reports found.</div>
      )}
    </div>
  );
};
