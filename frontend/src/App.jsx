import { useEffect, useState } from "react";
import React from "react";  
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Ask from "./components/Ask";
import Feed from "./components/Feed";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import Share from "./components/Share";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";

// Dummy auth state for demonstration (replace with real auth logic)
const useAuth = () => {
  // In real app, use Firebase or context
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("sciencehub_auth");
  });
  return [isAuthenticated, setIsAuthenticated];
};

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useAuth();
  const [section, setSection] = useState("feed");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Redirect to Feed after login/signup
  useEffect(() => {
    if (
      isAuthenticated &&
      ["/login", "/signup", "/"].includes(location.pathname)
    ) {
      navigate("/blog");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Show NavBar only on authenticated ("app") pages
  const showNavBar = ["/blog", "/tutorial", "/qna", "/profile"].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <div className="science-hub-root">
      {/* Hero/Header only on LandingPage */}
      {location.pathname === "/" && (
        <header className={`science-hub-hero ${scrolled ? "scrolled" : ""}`}>
          <div className="science-hub-hero-content">
            <h1>Science Hub</h1>
            <p className="science-hub-tagline">
              Where curiosity meets community. Share, learn, and explore science
              together!
            </p>
          </div>
          <div className="science-hub-hero-bg" />
          <div className="science-particles">
            <div className="particle p1"></div>
            <div className="particle p2"></div>
            <div className="particle p3"></div>
            <div className="particle p4"></div>
            <div className="particle p5"></div>
          </div>
        </header>
      )}
      {showNavBar && <NavBar section={section} setSection={setSection} />}
      <main className="science-hub-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={<LoginPage setAuth={setIsAuthenticated} />}
          />
          <Route
            path="/signup"
            element={<SignupPage setAuth={setIsAuthenticated} />}
          />
          {/* Authenticated pages */}
          <Route path="/blog" element={<Feed />} />
          <Route path="/tutorial" element={<Share />} />
          <Route path="/qna" element={<Ask />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
