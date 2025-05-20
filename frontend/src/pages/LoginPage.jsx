import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import React from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/blog");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-blue-100"
      >
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent mb-4">
          Science Hub Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg font-semibold placeholder:text-blue-300 bg-white/70"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg font-semibold placeholder:text-blue-300 bg-white/70"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-6 py-3 rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition-all mt-2"
        >
          Login
        </button>
        <p className="mt-4 text-center text-blue-900">
          Don't have an account?
          <a href="/signup" className="text-blue-600 hover:underline ml-1">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
