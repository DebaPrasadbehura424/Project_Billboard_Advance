import { useCitizen } from "../../hooks/useCitizen";
import { useSuper } from "../../hooks/useSuper";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, User } from "lucide-react";

export const ReportView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  let reports: any[] = [];
  var isCitizenContext = false;

  try {
    const citizenData = useCitizen();
    reports = citizenData.reports || [];
    isCitizenContext = true;
  } catch (e) {
    // CitizenProvider not available → try SuperProvider
    try {
      const superData = useSuper();
      reports = superData.reports || [];
    } catch (err) {
      console.error("No context provider found");
    }
  }

  const report = reports.find(
    (r: any) => r.reportId?.toString() === id || r.id?.toString() === id,
  );

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-gray-400 mb-6">
            The report with ID {id} does not exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-white">Report Details</h1>
        <div className="text-sm text-gray-500">
          ID: #{report.reportId || report.id}
        </div>
      </div>

      <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
        {/* Status Banner */}
        <div className="px-8 py-6 border-b border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-950">
          <div className="flex items-center gap-4">
            <span className="text-sm uppercase tracking-widest text-gray-500">
              Status
            </span>
            <span
              className={`px-5 py-2 rounded-full text-sm font-medium ${getStatusClass(report.reportStatus || report.status)}`}
            >
              {report.reportStatus || report.status}
            </span>
          </div>

          <div>
            <span className="text-sm text-gray-500">Risk Level</span>
            <span
              className={`ml-3 px-4 py-1 rounded-full text-sm font-medium ${
                (report.riskLevel || "").toUpperCase() === "HIGH"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-orange-500/10 text-orange-400"
              }`}
            >
              {report.riskLevel || "Medium"}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-10">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-4">
              {report.category}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {report.description || report.title || "No description available"}
            </p>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="text-blue-400 mt-1" size={28} />
            <div>
              <div className="text-sm text-gray-500 mb-1">LOCATION</div>
              <div className="text-white text-xl font-mono">
                Lat: {report.lat} • Lng: {report.lng}
              </div>
            </div>
          </div>

          {/* Images */}
          {report.reportPhotoEntities?.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Attached Photos
                </h3>
                <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">
                  {report.reportPhotoEntities.length} image
                  {report.reportPhotoEntities.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.reportPhotoEntities.map((photo: any, index: number) => (
                  <div
                    key={photo.id || index}
                    className="group relative rounded-2xl overflow-hidden border border-gray-700"
                  >
                    <img
                      src={photo.imageUrl}
                      alt="Report"
                      className="w-full h-72 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 p-4">
                      <p className="text-xs text-gray-400">
                        Photo ID: {photo.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-800">
            <div className="flex gap-4">
              <User size={26} className="text-gray-400 mt-1" />
              <div>
                <p className="text-gray-500 text-sm">Citizen</p>
                <p className="text-white">
                  {report.citizenName || report.citizenEntity?.name || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Calendar size={26} className="text-gray-400 mt-1" />
              <div>
                <p className="text-gray-500 text-sm">Field Worker</p>
                <p className="text-white">
                  {report.FieldWorker ||
                    report.fwEntity?.name ||
                    "Not Assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//  approvedFw show here is in sessionStorage.getItem("admin")

// Status Helper
const getStatusClass = (status: string = "") => {
  switch (status.toUpperCase()) {
    case "WORK_DONE":
      return "bg-green-500/10 text-green-400 border border-green-500/30";
    case "RESPOND_TAKEN":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
    case "ACTIVATED_BY_ADMIN":
    case "ACTIVATED_BY_DEPARTMENT":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    case "PASS_TO_WORKER":
      return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30";
    case "SEEN":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/30";
    case "RE_SUBMITTED":
      return "bg-orange-500/10 text-orange-400 border border-orange-500/30";
    default:
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
  }
};
