import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import React from "react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Validate username (3-15 chars, alphanumeric, no spaces)
  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{3,15}$/;
    return regex.test(username);
  };

  // Check if username is already taken
  const checkUsernameAvailability = async (username) => {
    const usernameDoc = await getDoc(doc(db, "usernames", username));
    return !usernameDoc.exists();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validate username
    if (!validateUsername(username)) {
      setError("ব্যবহারকারীর নাম ৩-১৫ অক্ষরের হতে হবে এবং শুধুমাত্র অক্ষর ও সংখ্যা থাকতে পারবে।");
      return;
    }

    // Check username availability
    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
      setError("এই ব্যবহারকারীর নাম ইতিমধ্যে ব্যবহৃত হয়েছে।");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড মেলেনি।");
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile with full name
      await updateProfile(user, { displayName: fullName });

      // Initialize user metrics and data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName || "অজ্ঞাত ব্যবহারকারী",
        username: username,
        email: user.email,
        profilePic: "👤",
        reputation: 0,
        reputationTitle: "Newbie",
        contribution: 0,
        contributionTitle: "New Contributor",
        learning: 0,
        learningTitle: "Learning Novice",
        blogsCount: 0,
        tutorialsCount: 0,
        commentsCount: 0
      });

      // Reserve username in usernames collection
      await setDoc(doc(db, "usernames", username), {
        uid: user.uid,
      });

      navigate("/"); // Redirect to homepage or feed
    } catch (err) {
      let errorMessage;
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "ইমেল ইতিমধ্যে ব্যবহৃত হয়েছে।";
          break;
        case "auth/invalid-email":
          errorMessage = "অবৈধ ইমেল ঠিকানা।";
          break;
        case "auth/weak-password":
          errorMessage = "পাসওয়ার্ড খুব দুর্বল। কমপক্ষে ৬ অক্ষর হতে হবে।";
          break;
        default:
          errorMessage = "সাইন আপ ব্যর্থ: " + err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="max-w-xl w-full px-4">
        <form
          onSubmit={handleSignup}
          className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
            সাইন আপ
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">পুরো নাম</label>
            <input
              type="text"
              placeholder="আপনার পুরো নাম লিখুন"
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              aria-label="পুরো নাম"
            />
          </div>

          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">ব্যবহারকারীর নাম</label>
            <input
              type="text"
              placeholder="একটি সংক্ষিপ্ত, অনন্য নাম লিখুন"
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-label="ব্যবহারকারীর নাম"
            />
            <p className="text-sm text-blue-600 mt-1">
              ৩-১৫ অক্ষর, শুধুমাত্র অক্ষর ও সংখ্যা, কোনো ফাঁকা স্থান নয়।
            </p>
          </div>

          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">ইমেল</label>
            <input
              type="email"
              placeholder="ইমেল লিখুন"
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="ইমেল"
            />
          </div>

          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">পাসওয়ার্ড</label>
            <input
              type="password"
              placeholder="পাসওয়ার্ড লিখুন"
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="পাসওয়ার্ড"
            />
          </div>

          <div className="mb-5">
            <label className="block text-blue-800 font-medium mb-2">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              type="password"
              placeholder="পাসওয়ার্ড পুনরায় লিখুন"
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-label="পাসওয়ার্ড নিশ্চিত করুন"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow transition-all"
          >
            সাইন আপ করুন
          </button>

          <div className="mt-6 text-center">
            <p className="text-blue-800">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <a
                href="/login"
                className="text-blue-500 hover:text-blue-700 font-semibold hover:underline transition-all"
              >
                লগইন করুন
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}