import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import React from "react";

const navItems = [
  { key: "blog", label: "ব্লগ", icon: "📰", path: "/blog" },
  { key: "tutorial", label: "টিউটোরিয়াল", icon: "📚", path: "/tutorial" },
  { key: "qna", label: "প্রশ্নোত্তর", icon: "❓", path: "/qna" },
  { key: "profile", label: "প্রোফাইল", icon: "👤", path: "/profile" },
];

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-2 relative">
        {/* Brand/Logo */}
        <Link
          to="/blog"
          className="flex items-center gap-2 font-extrabold text-2xl bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent tracking-wide select-none"
          tabIndex={0}
          aria-label="Science Hub Home"
        >
          <span className="text-3xl drop-shadow-md">🔬</span>
          <span className="hidden sm:inline">Science Hub</span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="sm:hidden text-3xl text-blue-500 ml-4 focus:outline-none"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation links */}
        <div
          className={`flex-col sm:flex-row sm:flex items-center gap-4 sm:gap-6 absolute sm:static left-0 right-0 top-full bg-white/95 sm:bg-transparent rounded-b-xl shadow-lg sm:shadow-none px-6 sm:px-0 py-4 sm:py-0 transition-all duration-300 ease-in-out z-40 ${
            menuOpen ? "flex" : "hidden sm:flex"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              tabIndex={0}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 select-none hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-400 hover:text-white focus:outline-none ${
                location.pathname.startsWith(item.path)
                  ? "bg-gradient-to-r from-blue-500 to-green-400 text-white shadow"
                  : "text-blue-900"
              }`}
              aria-current={
                location.pathname.startsWith(item.path) ? "page" : undefined
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          {/* Auth links */}
          <div className="flex items-center gap-2 ml-0 sm:ml-6 mt-4 sm:mt-0">
            <Link
              to="/login"
              className="text-blue-500 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              লগইন
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-4 py-1.5 rounded-md shadow hover:from-green-400 hover:to-blue-500 transition-all"
            >
              রেজিস্টার
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
