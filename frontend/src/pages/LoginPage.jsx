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
      navigate("/blog"); // go to homepage after login
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-signup-container">
      <form onSubmit={handleLogin} className="login-signup-form">
        <h2 className="login-signup-heading">Science Hub Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="login-signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="login-signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-signup-button">
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account?
          <a href="/signup" className="text-blue-600 hover:underline ml-1">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
