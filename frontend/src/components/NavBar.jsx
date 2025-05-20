import { useState } from "react";
import { colors, shadows } from "./styles";

const NavBar = ({ section, setSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { key: "feed", label: "হোম/ফিড", icon: "🏠" },
    { key: "ask", label: "প্রশ্ন করুন", icon: "❓" },
    { key: "share", label: "শেয়ার করুন", icon: "📣" },
    { key: "tutorials", label: "শিখুন", icon: "📚" },
    { key: "profile", label: "প্রোফাইল", icon: "👤" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.7rem 1.2rem",
        borderRadius: "2rem",
        background: "rgba(255,255,255,0.75)",
        boxShadow: shadows.medium,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1.5px solid ${colors.grayLight}`,
        margin: "0 auto 2.5rem auto",
        maxWidth: 900,
        position: "sticky",
        top: "1.5rem",
        zIndex: 100,
        width: "100%",
        minHeight: 60,
        transition: "box-shadow 0.3s, background 0.3s",
      }}
    >
      {/* Website name/logo */}
      <div
        style={{
          fontWeight: 900,
          fontSize: "1.5rem",
          color: colors.primary,
          letterSpacing: "1.5px",
          padding: "0.2rem 1.2rem 0.2rem 0.2rem",
          borderRadius: "1.2rem",
          background: "linear-gradient(90deg, #4b6fff22 60%, #25c9d022 100%)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexShrink: 0,
          boxShadow: "0 2px 8px #4b6fff11",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>🔬</span>
        <span style={{ whiteSpace: "nowrap" }}>বিজ্ঞান প্ল্যাটফর্ম</span>
      </div>
      {/* Hamburger menu for mobile */}
      <button
        className="nav-mobile-toggle"
        aria-label="Toggle menu"
        style={{
          display: "none",
          background: "none",
          border: "none",
          fontSize: "2rem",
          color: colors.primary,
          cursor: "pointer",
          marginLeft: "auto",
        }}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "✖️" : "☰"}
      </button>
      {/* Navigation buttons */}
      <div
        className="nav-links"
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
          ...(menuOpen
            ? {
                position: "absolute",
                top: "60px",
                left: 0,
                right: 0,
                background: "rgba(255,255,255,0.95)",
                borderRadius: "0 0 2rem 2rem",
                flexDirection: "column",
                zIndex: 200,
                boxShadow: shadows.medium,
                padding: "1rem 0",
              }
            : {}),
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.key}
            className={
              section === item.key ? "active-nav nav-button" : "nav-button"
            }
            style={{
              background:
                section === item.key
                  ? `linear-gradient(135deg, ${colors.primary}, ${colors.accent1})`
                  : "rgba(255,255,255,0.85)",
              color: section === item.key ? "#fff" : colors.dark,
              border:
                section === item.key
                  ? "none"
                  : `1.5px solid ${colors.grayLight}`,
              borderRadius: "1.2rem",
              padding: "0.7rem 1.2rem",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: section === item.key ? shadows.button : "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              minWidth: 0,
              position: "relative",
              overflow: "hidden",
              width: menuOpen ? "90%" : undefined,
              margin: menuOpen ? "0.3rem auto" : undefined,
            }}
            onClick={() => {
              setSection(item.key);
              setMenuOpen(false);
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
            <span className="nav-label" style={{ display: "inline-block" }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 700px) {
          .nav-mobile-toggle {
            display: block !important;
          }
          .nav-links {
            display: none !important;
          }
          .nav-links[style*='position: absolute'] {
            display: flex !important;
          }
        }
        @media (max-width: 480px) {
          .nav-label {
            display: none !important;
          }
          .nav-button {
            padding: 0.6rem !important;
            font-size: 1rem !important;
            margin: 0 2px !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
