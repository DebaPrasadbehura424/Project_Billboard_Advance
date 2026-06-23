import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, ShieldCheck, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SuperAdminHome: React.FC = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form
  const [loginForm, setLoginForm] = useState({
    specialId: "",
    password: "",
  });

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

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  // ==================== SUPER ADMIN LOGIN ====================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.specialId || !loginForm.password) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/admins/login",
        loginForm,
      );

      sessionStorage.setItem(
        "superAdminId",
        res.data.id || res.data.superAdminId,
      );

      alert(res.data.message || "Super Admin Login Successful!");
      navigate("/super_dash");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid Super Admin Credentials");
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
              <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nagrik NaZar</h1>
                <p className="text-xs text-violet-400 -mt-1">
                  Super Admin Portal
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
      <section className="bg-linear-to-br from-violet-700 via-purple-700 to-indigo-800 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Super Admin Portal
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Ultimate Control • Approve Admins • Monitor Entire System
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Super Admin Powers
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "👑",
              title: "Approve Admins",
              desc: "Review and approve admin applications",
            },
            {
              icon: "📊",
              title: "System Analytics",
              desc: "Global reports and performance metrics",
            },
            {
              icon: "👷‍♂️",
              title: "Manage All Admins",
              desc: "View, suspend or remove admins",
            },
            {
              icon: "🔍",
              title: "Monitor Everything",
              desc: "Full access to all reports & activities",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-violet-500 transition"
            >
              <div className="text-5xl mb-6">{item.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Login Section */}
      <section className="bg-gray-900 py-20 border-t border-gray-800">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold">Super Admin Login</h3>
              <p className="text-gray-400 mt-2">Highest level access only</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-8">
              <div>
                <label className="block text-gray-400 mb-3">
                  Super Admin ID / Email
                </label>
                <input
                  type="text"
                  name="specialId"
                  value={loginForm.specialId}
                  onChange={handleLoginChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:border-violet-500 outline-none"
                  placeholder="superadmin@nagriknazar.in"
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
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-5 text-white focus:border-violet-500 outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 py-5 rounded-2xl font-bold text-xl transition active:scale-95"
              >
                {isLoading ? "Logging in..." : "Login as Super Admin"}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-8">
              Only authorized super administrators can access this portal
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 text-center text-gray-500">
        <p>© 2026 Nagrik NaZar - Super Admin Portal</p>
      </footer>
    </div>
  );
};

export default SuperAdminHome;
