import { useNavigate } from "react-router-dom";
import { useCitizen } from "../../hooks/useCitizen";
import { Eye } from "lucide-react"; // Make sure lucide-react is installed

export const Myreport: React.FC = () => {
  const { reports } = useCitizen();
  const navigate = useNavigate();
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "WORK_DONE":
        return "bg-green-500/10 text-green-400 border border-green-500/30";

      case "RESPOND_TAKEN":
      case "ACTIVATED_BY_DEPARTMENT":
      case "ACTIVATED_BY_ADMIN":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";

      case "PASS_TO_WORKER":
      case "SEEN":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/30";

      case "RE_SUBMITTED":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/30";

      case "PENDING":
      default:
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
    }
  };
  const handleView = (reportId: number | string) => {
    navigate(`/cdash/report/${reportId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-white">My Reports</h2>
        <input
          type="text"
          placeholder="Search reports..."
          className="px-5 py-3 w-full sm:w-80 rounded-2xl border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-blue-500 placeholder-gray-500"
        />
      </div>

      <div className="bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-800">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="p-6 text-left text-sm font-semibold text-gray-300">
                  Issue
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-300">
                  Location
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-300">
                  Risk
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-300">
                  Status
                </th>
                <th className="p-6 text-center text-sm font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report.reportId}
                    className="hover:bg-gray-800/50 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="font-medium text-white">
                        {report.title || "no Title Here"}
                      </div>
                    </td>
                    <td className="p-6 text-gray-400">
                      <div className="space-y-1">
                        <div>
                          Lat: <span className="text-white">{report.lat}</span>
                        </div>
                        <div>
                          Lng: <span className="text-white">{report.lng}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium ${
                          report.riskLevel === "High"
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                        }`}
                      >
                        {report.riskLevel}
                      </span>
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
                          report.reportStatus,
                        )}`}
                      >
                        {report.reportStatus}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => handleView(report.reportId)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white transition-all duration-200 group-hover:scale-105"
                        title="View Report"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No reports found
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.reportId}
                className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-semibold text-white text-lg">
                      {report.category}
                    </div>
                    <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {report.description}
                    </div>
                  </div>
                  <button
                    onClick={() => handleView(report.reportId)}
                    className="p-3 bg-gray-700 hover:bg-blue-600 rounded-xl transition-colors"
                  >
                    <Eye size={22} className="text-gray-300" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Location</span>
                    <div className="text-white mt-1">
                      {report.lat}, {report.lng}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Risk</span>
                    <div className="mt-1">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          report.riskLevel === "High"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-orange-500/10 text-orange-400"
                        }`}
                      >
                        {report.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${
                      report.reportStatus === "Resolved"
                        ? "bg-green-500/10 text-green-400"
                        : report.reportStatus === "In Progress"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {report.reportStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {reports.length > 0 && (
        <p className="text-center text-gray-500 text-sm mt-6">
          Showing {reports.length} report{reports.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};
