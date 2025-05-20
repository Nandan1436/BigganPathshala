import { useState } from "react";
import { subjectColors } from "./styles";

const SubjectCard = ({ subject, color, icon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Bangla translations for subject names
  const subjectBangla = {
    Physics: "ভৌতবিজ্ঞান",
    Chemistry: "রসায়ন",
    Math: "গণিত",
    Biology: "জীববিজ্ঞান",
    "Environmental Science": "পরিবেশ বিজ্ঞান",
  };

  // Use gradient color scheme from styles.js
  const cardBg = subjectColors[subject] || color;

  return (
    <div
      className="subject-card"
      style={{
        background: isHovered
          ? `linear-gradient(135deg, ${cardBg}, #fff8)`
          : cardBg,
        borderRadius: "2rem",
        boxShadow: isHovered
          ? `0 24px 48px #4b6fff22, 0 0 0 2px #fff8`
          : `0 8px 24px #4b6fff11`,
        padding: "2.8rem 1.8rem 2.2rem 1.8rem",
        margin: "1.2rem",
        cursor: "pointer",
        transition:
          "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s, background 0.35s",
        transform: isHovered
          ? "translateY(-12px) scale(1.06)"
          : "translateY(0) scale(1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "200px",
        maxWidth: "260px",
        border: isHovered ? `2.5px solid #fff` : `2px solid #e0e7ef`,
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated floating background bubbles */}
      <div
        style={{
          position: "absolute",
          top: isHovered ? "-30px" : "-20px",
          right: isHovered ? "-30px" : "-20px",
          width: isHovered ? "120px" : "100px",
          height: isHovered ? "120px" : "100px",
          background: `radial-gradient(circle, #fff3 0%, transparent 70%)`,
          borderRadius: "50%",
          transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: isHovered ? "-40px" : "-30px",
          left: isHovered ? "-40px" : "-30px",
          width: isHovered ? "140px" : "120px",
          height: isHovered ? "140px" : "120px",
          background: `radial-gradient(circle, #fff2 0%, transparent 70%)`,
          borderRadius: "50%",
          transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
          zIndex: 0,
        }}
      />

      {/* Icon with pulsing and floating animation */}
      <div
        style={{
          fontSize: isHovered ? "3.6rem" : "3.2rem",
          marginBottom: "1.2rem",
          filter: `drop-shadow(0 4px 10px #fff8)`,
          backgroundColor: "rgba(255, 255, 255, 0.22)",
          backdropFilter: "blur(6px)",
          borderRadius: "50%",
          width: isHovered ? "90px" : "80px",
          height: isHovered ? "90px" : "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          animation: isHovered
            ? "pulse 1.5s infinite, float 2.5s infinite alternate"
            : "float 2.5s infinite alternate",
          zIndex: 1,
        }}
      >
        {icon}
        <style>{`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 #fff6; }
            70% { box-shadow: 0 0 0 16px #fff0; }
            100% { box-shadow: 0 0 0 0 #fff0; }
          }
          @keyframes float {
            0% { transform: translateY(0); }
            100% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
      <h2
        style={{
          margin: 0,
          fontWeight: 900,
          fontSize: "1.6rem",
          color: "#fff",
          letterSpacing: "1.5px",
          textShadow: `0 2px 12px #0005, 0 1px 0 #fff8`,
          position: "relative",
          zIndex: 2,
        }}
      >
        {subjectBangla[subject] || subject}
      </h2>
      {/* Bottom highlight */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "10px",
          background: `linear-gradient(90deg, #fff8 0%, #fff0 100%)`,
          borderBottomLeftRadius: "24px",
          borderBottomRightRadius: "24px",
          opacity: isHovered ? 1 : 0.7,
          transition: "opacity 0.3s ease",
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default SubjectCard;
