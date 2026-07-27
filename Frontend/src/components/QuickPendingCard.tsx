export const QuickPendingCard = ({ title, data, type, onApprove }: any) => (
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
