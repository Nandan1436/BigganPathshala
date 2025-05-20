import { Link } from "react-router-dom";
import React from "react";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 flex items-center justify-center px-4">
      <div className="max-w-4xl text-center">
        <img
          src="/science-illustration.svg"
          alt="Science Learning"
          className="w-64 mx-auto mb-6"
        />
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Explore Science with Community
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Learn, Share, and Grow with blogs, tutorials, and Q&A powered by
          science lovers and AI!
        </p>
        <div className="space-x-4">
          <Link to="/signup">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
              Get Started
            </button>
          </Link>
          <Link to="/login">
            <button className="px-6 py-3 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-100 transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
