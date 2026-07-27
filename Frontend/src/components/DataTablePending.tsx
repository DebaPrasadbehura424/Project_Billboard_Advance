import { Eye } from "lucide-react";

export const DataTablePending = ({
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
                  {formatDate(new Date().toLocaleDateString())}
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
