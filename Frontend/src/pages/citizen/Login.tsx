import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/api/citizens/login", form)
      .then((res) => {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("citizenId", res.data.id);

        alert(res.data.message);
        navigate("/cdash");
      })
      .catch((err) => {
        console.log(err.response.data);

        alert(err.response.data);
      });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left Side - Login Form */}
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

          <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign in to continue helping your city
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-900"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="#"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95"
            >
              Sign In
            </button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Create Account
              </NavLink>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image / Illustration */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center px-10 max-w-md">
            <div className="text-6xl mb-6">🏙️</div>
            <h3 className="text-4xl font-bold mb-4">Your City Needs You</h3>
            <p className="text-xl opacity-90 leading-relaxed">
              Login and continue reporting issues. Together we make Bhubaneswar
              and Odisha better.
            </p>
          </div>
        </div>

        {/* Decorative Bottom */}
        <div className="absolute bottom-10 left-10 text-white/70 text-sm">
          Nagrik NaZar © 2026
        </div>
      </div>
    </div>
  );
};

export default Login;
