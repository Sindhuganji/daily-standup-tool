import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white flex">
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 border-r border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-md">
          <h1 className="text-5xl font-black tracking-tight mb-5">
            ✨ Join Daily Standup
          </h1>
          <p className="text-slate-300 leading-relaxed">
            Build consistent team rhythm with daily accountability and clarity.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-2">Create account</h2>
          <p className="text-slate-300 mb-6">Start your standup workspace</p>

          <div className="space-y-4">
            <input
              name="name"
              placeholder="Full name"
              onChange={onChange}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={onChange}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={onChange}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl py-3 font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>

          <p className="text-sm text-slate-300 mt-6 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-300 hover:text-indigo-200 underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;