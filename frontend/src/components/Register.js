import { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // optional: success message (no UI redesign; simple alert)
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });

      // ✅ IMPORTANT: do NOT store token and do NOT auto-login
      alert("Registered successfully. Please login.");

      // ✅ redirect to login after successful registration
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}