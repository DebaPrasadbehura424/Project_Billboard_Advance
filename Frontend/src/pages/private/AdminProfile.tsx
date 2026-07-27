import React, { useState, useEffect } from "react";
import {
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  Tag,
  FileText,
  Loader2,
} from "lucide-react";
import { useParams } from "react-router-dom";

// Match your Java enum
type AdminStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";

interface AdminProfileData {
  adminId: number | null;
  email: string;
  document: string;
  name: string;
  phone: string;
  specialId: string;
  password: string;
  category: string;
  status: AdminStatus;
}

const AdminProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<AdminProfileData>({
    adminId: null,
    email: "",
    document: "",
    name: "",
    phone: "",
    specialId: "",
    password: "",
    category: "",
    status: "ACTIVE",
  });

  const [originalData, setOriginalData] = useState<AdminProfileData | null>(
    null,
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/admins/${id}`);
        if (!response.ok) throw new Error("Failed to load profile");
        const data = await response.json();
        setFormData(data);
        setOriginalData(data);
      } catch (err) {
        setError("Could not load admin profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleChange =
    (field: keyof AdminProfileData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    if (originalData) setFormData(originalData);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updated = await response.json();
      setFormData(updated);
      setOriginalData(updated);
      setIsEditing(false);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusClasses = (status: AdminStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border border-green-300";
      case "INACTIVE":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      case "SUSPENDED":
        return "bg-red-100 text-red-800 border border-red-300";
      case "PENDING":
        return "bg-amber-100 text-amber-800 border border-amber-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-4 max-w-4xl mx-auto font-sans text-gray-900">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold m-0">
          Admin Profile
        </h1>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Edit size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save
            </button>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center justify-between gap-3 mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="p-0.5 hover:bg-red-100 rounded"
          >
            <X size={14} />
          </button>
        </div>
      )}
      {success && (
        <div className="flex items-center justify-between gap-3 mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
          <span>{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="p-0.5 hover:bg-green-100 rounded"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-6">
          <div className="shrink-0 w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-semibold">
            {formData.name ? (
              formData.name.charAt(0).toUpperCase()
            ) : (
              <User size={36} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold m-0">
              {formData.name || "—"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5 mb-2">
              {formData.email}
            </p>
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClasses(
                formData.status,
              )}`}
            >
              {formData.status}
            </span>
          </div>
        </div>

        <hr className="border-t border-gray-200 m-0" />

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6">
          {/* Admin ID */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Admin ID
            </label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              value={formData.adminId ?? ""}
              readOnly
              disabled
            />
          </div>

          {/* Special ID */}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isEditing
                    ? "border-gray-300 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-700 cursor-default"
                }`}
                value={formData.name}
                onChange={handleChange("name")}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="email"
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isEditing
                    ? "border-gray-300 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-700 cursor-default"
                }`}
                value={formData.email}
                onChange={handleChange("email")}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isEditing
                    ? "border-gray-300 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-700 cursor-default"
                }`}
                value={formData.phone}
                onChange={handleChange("phone")}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Document */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Document
            </label>
            <div className="relative">
              <FileText
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <img
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${"border-gray-200 bg-gray-50 text-gray-700 cursor-default"}`}
                src={formData.document}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="relative">
              <Tag
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isEditing
                    ? "border-gray-300 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-700 cursor-default"
                }`}
                value={formData.category}
                onChange={handleChange("category")}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            {isEditing ? (
              <select
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.status}
                onChange={handleChange("status")}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="PENDING">PENDING</option>
              </select>
            ) : (
              <input
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-default"
                value={formData.status}
                readOnly
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
