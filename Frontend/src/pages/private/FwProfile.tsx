import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface FwEntity {
  id?: number;
  email: string;
  document: string; // image URL or base64
  specialId: string;
  password?: string; // usually not shown on frontend
  name: string;
  phone: string;
  category: string;
}

const FwProfile: React.FC<{}> = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<FwEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8080/api/fw/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to load profile (${response.status})`);
        }

        const data: FwEntity = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center  min-h-75">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center  min-h-75">
        <p className="text-gray-500">No profile found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shrink-0">
          {profile.document ? (
            <img
              src={profile.document}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Special ID: {profile.specialId}
          </p>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {profile.category}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Email
            </label>
            <p className="text-gray-800">{profile.email}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Phone
            </label>
            <p className="text-gray-800">{profile.phone}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Category
          </label>
          <p className="text-gray-800">{profile.category}</p>
        </div>

        {/* Password is intentionally hidden */}
      </div>
    </div>
  );
};

export default FwProfile;
