import React, { useState } from "react";
import { useCitizen } from "../../hooks/useCitizen";
import { Edit3, MapPin, Award, CheckCircle, Clock } from "lucide-react";

const Profile: React.FC = () => {
  const { user } = useCitizen();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditSave = () => {
    alert("Profile updated successfully! (Backend integration needed)");
    setIsEditModalOpen(false);
  };

  // Fallback if user is null
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-6xl font-bold text-white shadow-xl">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-900"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.name}
              </h1>
              <p className="text-gray-400 text-lg mb-1">{user.email}</p>
              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                <MapPin size={18} /> Age: {user.age} years
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition active:scale-95"
              >
                <Edit3 size={22} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-blue-500/30 transition">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-4 rounded-2xl">
                <Award className="text-blue-500" size={32} />
              </div>
              <div>
                <p className="text-4xl font-bold text-white">
                  {user.ImapactScore}
                </p>
                <p className="text-gray-400 text-sm">Impact Score</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-blue-500/30 transition">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/10 p-4 rounded-2xl">
                <CheckCircle className="text-purple-500" size={32} />
              </div>
              <div>
                <p className="text-4xl font-bold text-white">
                  {user.totalReports}
                </p>
                <p className="text-gray-400 text-sm">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-green-500/30 transition">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-4 rounded-2xl">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <div>
                <p className="text-4xl font-bold text-white">{user.Resolved}</p>
                <p className="text-gray-400 text-sm">Resolved</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-yellow-500/30 transition">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/10 p-4 rounded-2xl">
                <Clock className="text-yellow-500" size={32} />
              </div>
              <div>
                <p className="text-4xl font-bold text-white">{user.Pending}</p>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gray-900 rounded-3xl p-8 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-6">
            Citizen Activity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <p className="text-gray-400 mb-2">Member Since</p>
              <p className="text-white">March 2025</p>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Contribution Rank</p>
              <p className="text-white">Top 15% Active Citizens</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl w-full max-w-md p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Age</label>
                <input
                  type="text"
                  defaultValue={user.age}
                  className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
