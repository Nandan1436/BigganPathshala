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
import TutorialDetail from "./components/TutorialDetail";
import TutorialEditor from "./components/TutorialEditor";
import TutorialList from "./components/TutorialList";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import PostInput from "./components/input";

const useAuth = () => {
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (
      isAuthenticated &&
      ["/login", "/signup", "/"].includes(location.pathname)
    ) {
      navigate("/blog");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const showNavBar = ["/blog", "/tutorial", "/qna", "/profile"].some((p) =>
    location.pathname.startsWith(p)
  );

  //console.log("ENV:", import.meta.env);

  return (
    <div className="science-hub-root">
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
      {showNavBar && (
        <>
          <NavBar section={section} setSection={setSection} />
        </>
      )}
      <main className="w-full max-w-5xl mx-auto px-2 py-8 min-h-[70vh]">
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
          <Route path="/blog" element={<Feed />} />
          <Route path="/tutorial" element={<TutorialList />} />
          <Route path="/tutorial/new" element={<TutorialEditor />} />
          <Route path="/tutorial/:id" element={<TutorialDetail />} />
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