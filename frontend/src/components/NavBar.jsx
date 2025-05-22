import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import React from "react";

const navItems = [
  { key: "blog", label: "ব্লগ", icon: "📰", path: "/blog" },
  { key: "tutorial", label: "টিউটোরিয়াল", icon: "📚", path: "/tutorial" },
  { key: "qna", label: "প্রশ্নোত্তর", icon: "❓", path: "/qna" },
  { key: "profile", label: "প্রোফাইল", icon: "👤", path: "/profile" },
];

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ username: "", profilePic: "" });
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  // Track auth state and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              username: data.username || "অজ্ঞাত ব্যবহারকারী",
              profilePic: data.profilePic || "👤",
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUserData({ username: "", profilePic: "" });
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      setDropdownOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

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
              aria-current={location.pathname.startsWith(item.path) ? "page" : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          {/* User section */}
          <div className="flex items-center gap-2 ml-0 sm:ml-6 mt-4 sm:mt-0">
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-md text-blue-900 hover:bg-blue-50 transition-colors focus:outline-none"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  {userData.profilePic && userData.profilePic !== "👤" ? (
                    <img
                      src={userData.profilePic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-300"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                  <span className="hidden sm:inline font-semibold">{userData.username}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-blue-100 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      <span className="text-lg">👤</span>
                      প্রোফাইল
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-blue-900 hover:bg-blue-50 transition-colors w-full text-left"
                    >
                      <span className="text-lg">🚪</span>
                      লগআউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-500 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  লগইন
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-4 py-1.5 rounded-md shadow hover:from-green-400 hover:to-blue-500 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  রেজিস্টার
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;