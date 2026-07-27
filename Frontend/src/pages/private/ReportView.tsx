import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  User,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  Shield,
  Hash,
  UserCheck,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export const ReportView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState<{
    report: any;
    citizen: any;
    fws: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        // Change the base URL if needed
        const response = await axios.get(
          `http://localhost:8080/api/reports/${id}`,
        );

        // Backend returns: { reports, citizen, fws }
        setReportData(response.data);
      } catch (err: any) {
        console.error("Failed to fetch report:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load report",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  console.log(reportData);

  if (loading) {
    return <div className="p-6">Loading report...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
        <button onClick={() => navigate(-1)} className="ml-4 underline">
          Go back
        </button>
      </div>
    );
  }

  if (!reportData) {
    return <div className="p-6">Report not found</div>;
  }

  const { report, citizen, fws } = reportData;

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
            <FileText size={36} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-gray-400 mb-8">
            The report with ID{" "}
            <span className="text-white font-mono">#{id}</span> does not exist
            or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 mx-auto transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Safe values with defaults
  const reportId = report.reportId || report.id || "—";
  const status = report.reportStatus || report.status || "UNKNOWN";
  const riskLevel = (report.riskLevel || "MEDIUM").toUpperCase();
  const riskPercentage = report.riskPercentage ?? null;
  const category = report.category || "Uncategorized";
  const description =
    report.description ||
    report.title ||
    "No description provided for this report.";
  const lat = report.lat ?? null;
  const lng = report.lng ?? null;

  const photos = report.reportPhotoEntities || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={22}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            Report Details
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Hash size={16} />
            <span className="font-mono">#{reportId}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* Status + Risk Banner */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-8">
          <div className="px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-linear-to-r from-gray-900 to-gray-950">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                Current Status
              </span>
              <span
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusClass(
                  status,
                )}`}
              >
                {formatStatus(status)}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 sm:items-end">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                Risk Level
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${getRiskClass(
                    riskLevel,
                  )}`}
                >
                  <AlertTriangle size={14} />
                  {riskLevel}
                </span>
                {riskPercentage !== null && (
                  <span className="text-sm text-gray-400 font-mono">
                    {riskPercentage}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 space-y-10">
            {/* Category + Description */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} className="text-blue-400" />
                <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                  Category
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {category}
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </section>

            {/* Location */}
            <section className="bg-gray-950/60 rounded-2xl p-5 border border-gray-800">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <MapPin size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-1">
                    Location
                  </p>
                  {lat !== null && lng !== null ? (
                    <p className="text-white text-lg font-mono tracking-tight">
                      Lat: {Number(lat).toFixed(6)} • Lng:{" "}
                      {Number(lng).toFixed(6)}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-lg">
                      Location coordinates not available
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Photos */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <ImageIcon size={20} className="text-gray-400" />
                <h3 className="text-xl font-semibold text-white">
                  Attached Photos
                </h3>
                {photos.length > 0 && (
                  <span className="bg-gray-800 text-gray-400 px-3 py-0.5 rounded-full text-xs font-medium">
                    {photos.length} {photos.length === 1 ? "image" : "images"}
                  </span>
                )}
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {photos.map((photo: any, index: number) => (
                    <div
                      key={photo.id || index}
                      className="group relative rounded-2xl overflow-hidden border border-gray-700 bg-gray-950"
                    >
                      <img
                        src={photo.imageUrl || "#"}
                        alt={`Report photo ${index + 1}`}
                        className="w-full h-64 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4">
                        <p className="text-xs text-gray-300 font-mono">
                          Photo ID: {photo.id ?? index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-950/50 py-14 flex flex-col items-center justify-center text-gray-500">
                  <ImageIcon size={36} className="mb-3 opacity-50" />
                  <p className="text-sm">No photos attached to this report</p>
                </div>
              )}
            </section>

            {/* Meta Info Grid */}
            <section className="pt-8 border-t border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Citizen */}
                <div className="bg-gray-950/50 rounded-2xl p-5 border border-gray-800 flex gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                    <User size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-1">
                      Citizen
                    </p>
                    {citizen ? (
                      <>
                        <p className="text-white text-lg font-medium truncate">
                          Name : {citizen?.citizenName}
                        </p>
                        <p className="text-white text-lg font-medium truncate">
                          Age : {citizen?.age}
                        </p>
                        <p className="text-white text-lg font-medium truncate">
                          Email : {citizen?.email}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 text-lg italic">
                        Not revealed
                      </p>
                    )}
                  </div>
                </div>

                {/* Field Worker */}
                <div className="bg-gray-950/50 rounded-2xl p-5 border border-gray-800 flex gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <UserCheck size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-1">
                      Field Worker
                    </p>
                    {fws ? (
                      <>
                        <p className="text-white text-lg font-medium truncate">
                          Name : {fws.name}
                        </p>
                        <p className="text-white text-lg font-medium truncate">
                          Category : {fws.category}
                        </p>
                        <p className="text-white text-lg font-medium truncate">
                          Phone : {fws.phone}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 text-lg italic">
                        Not Assigned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Extra Info Footer */}
            <section className="pt-6 border-t border-gray-800">
              <div className="flex items-start gap-3 text-sm text-gray-500">
                <Info size={16} className="mt-0.5 shrink-0" />
                <p>
                  All available data for this report is shown above. Missing
                  fields are intentionally marked as “Not revealed” or “Not
                  Assigned”.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ---------- Helpers ---------- */

const formatStatus = (status: string = "") => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getStatusClass = (status: string = "") => {
  switch (status.toUpperCase()) {
    case "WORK_DONE":
      return "bg-green-500/10 text-green-400 border-green-500/30";
    case "RESPOND_TAKEN":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "ACTIVATED_BY_ADMIN":
    case "ACTIVATED_BY_DEPARTMENT":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    case "PASS_TO_WORKER":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "SEEN":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "RE_SUBMITTED":
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    default:
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  }
};

const getRiskClass = (level: string = "") => {
  switch (level.toUpperCase()) {
    case "HIGH":
      return "bg-red-500/10 text-red-400 border border-red-500/30";
    case "MEDIUM":
      return "bg-orange-500/10 text-orange-400 border border-orange-500/30";
    case "LOW":
      return "bg-green-500/10 text-green-400 border border-green-500/30";
    default:
      return "bg-gray-500/10 text-gray-400 border border-gray-500/30";
  }
};
