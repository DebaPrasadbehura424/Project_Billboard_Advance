import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  Upload,
  MapPin,
  Camera,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FwHome: React.FC = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(true); // Default dark
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);

  // Login Form
  const [loginForm, setLoginForm] = useState({
    specialId: "",
    password: "",
  });

  // Register Form
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleDark = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  // Handle Login Change
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Register Change
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  // Document Upload
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
      setDocumentPreview(URL.createObjectURL(file));
    }
  };

  // ==================== LOGIN ====================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.specialId || !loginForm.password) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/fw/login",
        loginForm,
      );

      sessionStorage.setItem("fwToken", res.data.token);
      sessionStorage.setItem("fwId", res.data.id || res.data.fwId);

      alert(res.data.message || "Login Successful!");
      navigate("/fw_dash"); // Change route as per your routing
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid Field Worker Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== REGISTER ====================
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.phone ||
      !documentFile
    ) {
      alert("Please fill all fields and upload document");
      return;
    }

    setIsLoading(true);

    let publicId;
    try {
      const cloudFormData = new FormData();
      cloudFormData.append("file", documentFile);
      cloudFormData.append("upload_preset", "citizen_reports");
      cloudFormData.append("folder", "Billboard/fw_document");

      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dlpsg1fah/image/upload",
        cloudFormData,
      );

      const documentUrl = cloudinaryResponse.data.secure_url;
      publicId = cloudinaryResponse.data.public_id;
      await axios.post("http://localhost:8080/api/fw/apply", {
        ...registerForm,
        document: documentUrl,
      });

      alert(
        "Application Submitted Successfully!\n\nPlease wait for approval from superior authority.",
      );

      setRegisterForm({ name: "", email: "", phone: "" });
      setDocumentFile(null);
      setDocumentPreview(null);
      setShowForm("login");
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nagrik NaZar</h1>
                <p className="text-xs text-emerald-400 -mt-1">
                  Field Worker Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDark}
                className="p-3 rounded-2xl hover:bg-gray-800 transition"
              >
                {isDark ? <Sun size={22} /> : <Moon size={22} />}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-linear-to-br from-emerald-700 via-teal-700 to-cyan-800 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Field Worker Portal
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Resolve civic issues on ground • Update status in real-time • Earn
            rewards
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          What Field Workers Can Do
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <MapPin className="w-12 h-12 text-emerald-400" />,
              title: "View Assigned Reports",
              desc: "Get nearby civic complaints with location",
            },
            {
              icon: <Camera className="w-12 h-12 text-emerald-400" />,
              title: "Take Action & Evidence",
              desc: "Upload photos and complete work on-site",
            },
            {
              icon: <CheckCircle className="w-12 h-12 text-emerald-400" />,
              title: "Update Status",
              desc: "Mark resolved / in-progress / need help",
            },
            {
              icon: "💰",
              title: "Earn Rewards",
              desc: "Get paid according to work completed",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-emerald-500 transition"
            >
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Login / Register Section */}
      <section className="bg-gray-900 py-20 border-t border-gray-800">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-10">
            <div className="flex justify-center gap-4 mb-10 border-b border-gray-800 pb-6">
              <button
                onClick={() => setShowForm("login")}
                className={`px-10 py-4 rounded-2xl font-semibold transition ${
                  showForm === "login"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                Field Worker Login
              </button>
              <button
                onClick={() => setShowForm("register")}
                className={`px-10 py-4 rounded-2xl font-semibold transition ${
                  showForm === "register"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                Register as Field Worker
              </button>
            </div>

            {/* LOGIN FORM */}
            {showForm === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-8">
                <div>
                  <label className="block text-gray-400 mb-3">
                    Field Worker ID / Email
                  </label>
                  <input
                    type="text"
                    name="specialId"
                    value={loginForm.specialId}
                    onChange={handleLoginChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:border-emerald-500 outline-none"
                    placeholder="fw@nagriknazar.in"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-3">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:border-emerald-500 outline-none"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 py-5 rounded-2xl font-bold text-xl transition active:scale-95"
                >
                  {isLoading ? "Logging in..." : "Login as Field Worker"}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {showForm === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-8">
                <div>
                  <label className="block text-gray-400 mb-3">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:border-emerald-500 outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:border-emerald-500 outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:border-emerald-500 outline-none"
                    placeholder="10 digit mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-3">
                    Upload Documents (ID + Address Proof)
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-700 hover:border-emerald-500 rounded-3xl p-12 text-center cursor-pointer transition"
                    onClick={() =>
                      document.getElementById("docUpload")?.click()
                    }
                  >
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-400">Click to upload PDF or JPG</p>
                    <input
                      id="docUpload"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                  </div>
                  {documentPreview && (
                    <p className="text-green-400 text-sm mt-3">
                      ✅ Selected: {documentFile?.name}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 py-5 rounded-2xl font-bold text-xl transition active:scale-95"
                >
                  {isLoading ? "Submitting..." : "Submit Application"}
                </button>

                <p className="text-center text-gray-400 text-sm">
                  Your application will be reviewed. You will receive Field
                  Worker ID &amp; Password via email after approval.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 text-center text-gray-500">
        <p>© 2026 Nagrik NaZar - Field Worker Portal</p>
      </footer>
    </div>
  );
};

export default FwHome;
