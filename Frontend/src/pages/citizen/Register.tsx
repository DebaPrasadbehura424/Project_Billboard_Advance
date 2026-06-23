import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Calendar } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    citizenName: "",
    password: "",
    age: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordRules({
        minLength: value.length >= 6,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/citizens/register", form)
      .then((res) => {
        alert(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err.response.data);

        alert("Something wrong in Register");
      });
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              👁️
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Nagrik NaZar
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Citizen Empowerment Platform
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join us in making our city better
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="citizenName"
                  value={form.citizenName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-900"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-900"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-900"
                  placeholder="Enter your age"
                  min="18"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-900"
                  placeholder="Create strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Rules */}
              {form.password && (
                <div className="mt-4 space-y-2 text-sm">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password must contain:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "At least 6 characters",
                        valid: passwordRules.minLength,
                      },
                      {
                        label: "One uppercase letter",
                        valid: passwordRules.uppercase,
                      },
                      {
                        label: "One lowercase letter",
                        valid: passwordRules.lowercase,
                      },
                      { label: "One number", valid: passwordRules.number },
                      {
                        label: "One special character",
                        valid: passwordRules.special,
                      },
                    ].map((rule, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 ${rule.valid ? "text-green-600" : "text-gray-400"}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border ${rule.valid ? "bg-green-600 border-green-600" : "border-gray-400"} flex items-center justify-center`}
                        >
                          {rule.valid && "✓"}
                        </div>
                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!isPasswordValid && form.password.length > 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95"
            >
              Create Account
            </button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign In
              </NavLink>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image / Illustration */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />

        {/* You can replace this with your actual image */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center px-10">
            <div className="text-6xl mb-6">🏙️</div>
            <h3 className="text-4xl font-bold mb-4">Be the Change</h3>
            <p className="text-xl opacity-90">
              Report civic issues and help build a better, smarter city together
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-10 text-white/70 text-sm">
          Nagrik NaZar © 2026
        </div>
      </div>
    </div>
  );
};

export default Register;
