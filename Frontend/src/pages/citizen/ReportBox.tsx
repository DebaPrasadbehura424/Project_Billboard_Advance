import React, { useState } from "react";
import { MapPin, Upload, X, Loader2 } from "lucide-react";
import axios from "axios";
import { useCitizen } from "../../hooks/useCitizen";
import type { Report } from "../../context/CitizenContext";

// ==================== API CONFIG ====================
const API_BASE = {
  AI_DETECTION: "http://127.0.0.1:5001/image_detection",
  CLOUDINARY: "https://api.cloudinary.com/v1_1/dlpsg1fah/image/upload",
  BACKEND: "http://localhost:8080/api/reports/create",
  UPLOAD_PRESET: "citizen_reports",
  FOLDER: "Billboard/reports_image",
};

// ==================== COMPONENT ====================
const ReportBox: React.FC = () => {
  const { setReports } = useCitizen();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Multiple Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);

      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  // Remove Image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Get Current Location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsGettingLocation(false);
        },
        () => {
          alert("Unable to get location. Please enable location permission.");
          setIsGettingLocation(false);
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsGettingLocation(false);
    }
  };

  // ==================== API FUNCTIONS ====================

  const detectWithAI = async (formData: FormData) => {
    const response = await axios.post(API_BASE.AI_DETECTION, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  const uploadToCloudinary = async (image: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", API_BASE.UPLOAD_PRESET);
    formData.append("folder", API_BASE.FOLDER);

    const response = await axios.post(API_BASE.CLOUDINARY, formData);
    return response.data.secure_url;
  };

  const submitToBackend = async (reportData: any, token: string | null) => {
    const response = await axios.post(API_BASE.BACKEND, reportData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  // ==================== SUBMIT HANDLER ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || images.length === 0 || !location.lat || !location.lng) {
      alert("Please fill all required fields and upload at least one photo.");
      return;
    }

    setIsSubmitting(true);

    try {
      // STEP 1: AI Detection
      const aiFormData = new FormData();
      aiFormData.append("description", description);
      aiFormData.append("category", category);
      images.forEach((image) => aiFormData.append("image", image));
      aiFormData.append("latitude", location.lat.toString());
      aiFormData.append("longitude", location.lng.toString());

      const aiResponse = await detectWithAI(aiFormData);
      console.log("AI Response:", aiResponse);

      // STEP 2: Upload Images to Cloudinary
      const uploadedImageUrls: string[] = [];
      for (const image of images) {
        const url = await uploadToCloudinary(image);
        uploadedImageUrls.push(url);
      }
      console.log("Cloudinary URLs:", uploadedImageUrls);

      // STEP 3: Send to Backend
      const token = sessionStorage.getItem("token");

      const reportData = {
        description,
        riskLevel: aiResponse.risk_level,
        riskPercentage: aiResponse.risk_percentage,
        lat: location.lat,
        lng: location.lng,
        imageUrls: uploadedImageUrls,
      };

      const savedReport = await submitToBackend(reportData, token);
      console.log("Saved Report:", savedReport);

      // Update Context
      setReports((prev: Report[]) => [...prev, savedReport]);

      alert(
        `Report Submitted Successfully!\nRisk Level: ${aiResponse.risk_level}\nRisk Percentage: ${aiResponse.risk_percentage}%`,
      );

      // Reset Form
      setDescription("");
      setCategory("");
      setImages([]);
      setImagePreviews([]);
      setLocation({ lat: null, lng: null });
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit report. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-800">
        <h2 className="text-4xl font-bold text-white mb-2">
          Report a New Civic Issue
        </h2>
        <p className="text-gray-400 mb-10 text-lg">
          Your report will be analyzed by AI and forwarded to authorities
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Image Upload */}
          <div>
            <label className="block text-white text-lg font-medium mb-4">
              Upload Photos of Issue <span className="text-red-500">*</span>
            </label>
            <div
              className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-3xl p-12 flex flex-col items-center justify-center transition cursor-pointer bg-gray-950"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <Upload className="text-6xl mb-4 text-gray-500" />
              <p className="text-white font-medium text-xl">
                Click to upload multiple photos
              </p>
              <p className="text-gray-500 mt-2">JPG, PNG (Max 5MB each)</p>
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-40 object-cover rounded-2xl border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-white text-lg font-medium mb-3">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-48 p-6 bg-gray-950 border border-gray-700 rounded-3xl text-white placeholder-gray-500 focus:border-blue-500 resize-none"
              placeholder="Describe what you saw in detail..."
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-white text-lg font-medium mb-3">
              Location <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-5 rounded-3xl font-semibold text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {isGettingLocation ? (
                <Loader2 className="animate-spin" size={26} />
              ) : (
                <MapPin size={26} />
              )}
              {isGettingLocation
                ? "Detecting Location..."
                : "Get My Current Location"}
            </button>

            {location.lat && location.lng && (
              <p className="mt-4 text-green-400 font-medium text-center">
                ✅ Location Captured: {location.lat.toFixed(6)},{" "}
                {location.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-6 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={28} />
                Submitting Report...
              </>
            ) : (
              "Submit Complaint"
            )}
          </button>

          <p className="text-center text-gray-500 text-sm">
            Report Status will be{" "}
            <strong className="text-white">Pending</strong> by default
          </p>
        </form>
      </div>
    </div>
  );
};

export default ReportBox;
