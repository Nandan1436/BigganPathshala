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
          কমিউনিটির সঙ্গে বিজ্ঞানের নতুন দিগন্তে যাত্রা
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          বিজ্ঞান প্রেমীদের সাথে ব্লগ, টিউটোরিয়াল ও প্রশ্নোত্তরের মাধ্যমে শিখুন ও অগ্রগতি অর্জন করুন! এআই-চালিত প্ল্যাটফর্মে যোগ দিন।
        </p>
        <div className="space-x-4">
          <Link to="/signup">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
              শুরু করো
            </button>
          </Link>
          <Link to="/login">
            <button className="px-6 py-3 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-100 transition">
              লগইন
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}