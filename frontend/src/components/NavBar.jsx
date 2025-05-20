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
    <nav className="science-hub-nav" aria-label="Primary Navigation">
      <div className="nav-container">
        {/* Brand/Logo */}
        <Link
          to="/blog"
          className="nav-logo"
          tabIndex={0}
          aria-label="Science Hub Home"
        >
          <span className="nav-logo-icon">🔬</span>
          <span className="nav-logo-text">Science Hub</span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation links */}
        <div className={`nav-items${menuOpen ? " mobile-open" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`nav-item${
                location.pathname.startsWith(item.path) ? " active" : ""
              }`}
              aria-current={
                location.pathname.startsWith(item.path) ? "page" : undefined
              }
              tabIndex={0}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-item-icon" aria-hidden>
                {item.icon}
              </span>
              <span className="nav-item-label">{item.label}</span>
            </Link>
          ))}
          {/* Auth links */}
          <div className="nav-auth">
            <Link to="/login" className="nav-auth-link">
              লগইন
            </Link>
            <Link to="/signup" className="nav-auth-button">
              রেজিস্টার
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
