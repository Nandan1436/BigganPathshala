// Common styling variables and components
export const colors = {
  primary: "#4b6fff", // Brighter blue
  secondary: "#ff6b9d", // Vibrant pink
  accent1: "#25c9d0", // Turquoise
  accent2: "#ffa537", // Orange
  accent3: "#a45dff", // Purple
  light: "#f8faff",
  dark: "#1f2b49",
  success: "#2ecc71",
  gray: "#8894a9",
  grayLight: "#e0e7ef",
};

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary}, #25c9d0)`,
  secondary: `linear-gradient(135deg, ${colors.secondary}, #ff9e58)`,
  accent1: `linear-gradient(135deg, ${colors.accent1}, #4be3d0)`,
  accent2: `linear-gradient(135deg, ${colors.accent2}, #ffcf8c)`,
  accent3: `linear-gradient(135deg, ${colors.accent3}, #c496ff)`,
};

export const shadows = {
  small: "0 2px 10px rgba(75, 111, 255, 0.12)",
  medium: "0 8px 30px rgba(75, 111, 255, 0.18)",
  large: "0 15px 50px rgba(75, 111, 255, 0.25)",
  button: "0 4px 14px rgba(75, 111, 255, 0.25)",
  card: "0 8px 24px rgba(31, 43, 73, 0.08)",
};

export const buttonStyle = {
  border: "none",
  borderRadius: "10px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: shadows.button,
  padding: "0.75rem 1.8rem",
};

export const cardStyle = {
  background: colors.light,
  borderRadius: "16px",
  padding: "1.5rem",
  boxShadow: shadows.card,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

// Map subjects to consistent colors
export const subjectColors = {
  Physics: `linear-gradient(135deg, ${colors.primary} 60%, ${colors.accent1} 100%)`,
  Chemistry: `linear-gradient(135deg, ${colors.secondary} 60%, ${colors.accent2} 100%)`,
  Math: `linear-gradient(135deg, ${colors.accent3} 60%, ${colors.primary} 100%)`,
  Biology: `linear-gradient(135deg, ${colors.accent1} 60%, ${colors.secondary} 100%)`,
  "Environmental Science": `linear-gradient(135deg, ${colors.accent2} 60%, ${colors.accent1} 100%)`,
};
