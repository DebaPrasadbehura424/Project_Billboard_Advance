import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";

const Home: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stats = [
    { number: "12,458", label: "Issues Reported" },
    { number: "9,872", label: "Issues Resolved" },
    { number: "79%", label: "Success Rate" },
  ];

  const testimonials = [
    {
      text: "Finally a platform that actually listens! My pothole was fixed in just 4 days.",
      name: "Rahul Sharma",
      location: "Bhubaneswar",
    },
    {
      text: "AI detection is spot on. Very impressed with the speed.",
      name: "Priya Patel",
      location: "Cuttack",
    },
    {
      text: "Easy to use and transparent tracking. Highly recommended.",
      name: "Amit Kumar",
      location: "Rourkela",
    },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Nagrik NaZar
                </h1>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Home
              </a>
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("how")}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                How it Works
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="primary" onClick={() => navigate("/login")}>
                Login
              </Button>

              <button
                onClick={() => setIsDark(!isDark)}
                className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-3"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t">
            <div className="px-6 py-6 space-y-4 text-lg">
              <a href="#" className="block">
                Home
              </a>
              <button
                onClick={() => {
                  scrollToSection("about");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left"
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToSection("how");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left"
              >
                How it Works
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Your Voice,
            <br />
            Our Vision
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-90">
            AI-powered platform helping citizens report and resolve civic issues
            faster
          </p>

          {/* Your Image Carousel Area */}
          <div className="w-full h-[400px] bg-black/20 rounded-3xl mb-12 flex items-center justify-center border border-white/20">
            <p className="text-white/70 text-lg">
              Image Carousel Goes Here (You will add this)
            </p>
          </div>

          <Button variant="primary" className="text-lg px-12 py-4">
            Report an Issue Now
          </Button>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                {stat.number}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-20">
        <Card>
          <h2 className="text-4xl font-bold text-center mb-10">
            About Nagrik NaZar
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-center max-w-4xl mx-auto">
            Nagrik NaZar is an intelligent civic platform that empowers citizens
            to report road issues like potholes, broken traffic lights, water
            logging, and more. Using advanced AI, we automatically detect the
            problem, assess its risk, and forward it to the concerned government
            authorities for faster resolution.
          </p>
          <p className="text-center mt-6 text-blue-600 dark:text-blue-400 font-medium">
            Making cities safer, cleaner, and smarter — one report at a time.
          </p>
        </Card>
      </section>

      {/* How It Works - More Informative */}
      <section id="how" className="bg-gray-100 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="text-blue-600 text-5xl font-bold mb-4">01</div>
              <h3 className="text-2xl font-semibold mb-3">Capture the Issue</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Open the app, click a photo of the problem (pothole, broken
                light, garbage, etc.) and submit with location.
              </p>
            </Card>

            <Card>
              <div className="text-blue-600 text-5xl font-bold mb-4">02</div>
              <h3 className="text-2xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI instantly identifies the issue type, severity level, and
                urgency. It even suggests the correct department.
              </p>
            </Card>

            <Card>
              <div className="text-blue-600 text-5xl font-bold mb-4">03</div>
              <h3 className="text-2xl font-semibold mb-3">
                Action &amp; Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complaint is forwarded to municipal corporation with all
                details. You can track real-time status until resolved.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          What People Are Saying
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i}>
              <p className="italic text-lg mb-6">“{t.text}”</p>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.location}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-white dark:bg-gray-900">
        <h2 className="text-4xl font-bold text-center mb-12">
          Our Recognitions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            "Smart Odisha Award 2025",
            "Digital India Innovation",
            "Best Civic Tech",
            "Govt. of India Certified",
          ].map((award, i) => (
            <Card key={i} className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <p className="font-medium">{award}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-white text-2xl font-bold mb-3">Nagrik NaZar</h3>
            <p className="text-sm">
              Empowering citizens for better cities through technology.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>Report Issue</li>
              <li>Track Complaint</li>
              <li>About Us</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              Government Partners
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Bhubaneswar Municipal Corporation</li>
              <li>Odisha Smart City Limited</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm">support@nagriknazar.in</p>
            <p className="text-sm">1800-xxx-xxxx</p>
            <p className="text-xs mt-6">
              © 2026 Nagrik NaZar. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
