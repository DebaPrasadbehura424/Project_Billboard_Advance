import React, { useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom colored icons
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">📍</div>
      </div>
    `,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
  });
};

interface Issue {
  id: number;
  lat: number;
  lng: number;
  issue: string;
  status: "Open" | "In Progress" | "Closed";
  location: string;
}

// Dummy Data
const dummyData: Issue[] = [
  {
    id: 1,
    lat: 28.6139,
    lng: 77.209,
    issue: "Pothole on main road",
    status: "Open",
    location: "Delhi",
  },
  {
    id: 2,
    lat: 19.076,
    lng: 72.8777,
    issue: "Water logging",
    status: "In Progress",
    location: "Mumbai",
  },
  {
    id: 3,
    lat: 28.7041,
    lng: 77.1025,
    issue: "Street light not working",
    status: "Closed",
    location: "Delhi",
  },
  {
    id: 4,
    lat: 12.9716,
    lng: 77.5946,
    issue: "Garbage pileup",
    status: "Open",
    location: "Bangalore",
  },
  {
    id: 5,
    lat: 22.5726,
    lng: 88.3639,
    issue: "Fallen tree",
    status: "In Progress",
    location: "Kolkata",
  },
  {
    id: 6,
    lat: 13.0827,
    lng: 80.2707,
    issue: "Broken road divider",
    status: "Closed",
    location: "Chennai",
  },
  {
    id: 7,
    lat: 17.385,
    lng: 78.4867,
    issue: "Illegal dumping",
    status: "Open",
    location: "Hyderabad",
  },
  {
    id: 8,
    lat: 26.8467,
    lng: 80.9462,
    issue: "Flooded underpass",
    status: "In Progress",
    location: "Lucknow",
  },
];

const statusColors = {
  Open: "#ef4444", // red
  "In Progress": "#f59e0b", // amber
  Closed: "#22c55e", // green
};

const HeatMap: React.FC = () => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "Open",
    "In Progress",
    "Closed",
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data
  const filteredData = useMemo(() => {
    return dummyData.filter((item) => {
      const matchesStatus = selectedStatuses.includes(item.status);
      const matchesSearch =
        item.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [selectedStatuses, searchTerm]);

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      if (selectedStatuses.length > 1) {
        setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
      }
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header & Filters */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Issue HeatMap
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search issues or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filters */}
            {/* Status Filter - Select Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Status:
              </label>
              <select
                value={
                  selectedStatuses.length === 3
                    ? "All"
                    : selectedStatuses[0] || ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "All") {
                    setSelectedStatuses(["Open", "In Progress", "Closed"]);
                  } else {
                    setSelectedStatuses([value]);
                  }
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            Showing {filteredData.length} of {dummyData.length} issues
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredData.map((item) => (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={createColoredIcon(statusColors[item.status])}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: statusColors[item.status] }}
                    />
                    <span className="font-semibold text-lg">{item.status}</span>
                  </div>

                  <p className="font-medium text-gray-900 mb-1">{item.issue}</p>
                  <p className="text-sm text-gray-600">{item.location}</p>

                  <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                    Lat: {item.lat.toFixed(4)} | Lng: {item.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white border-t p-4 text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-x-8 gap-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#ef4444" }}
            ></div>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#f59e0b" }}
            ></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "#22c55e" }}
            ></div>
            <span>Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
