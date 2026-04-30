import { jwtDecode } from 'jwt-decode';
import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  let email = "user@email.com";
  let initial = "U";

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded?.email || email;
      initial = email?.[0]?.toUpperCase() || "U";
    } catch {}
  }

  const items = [
    { label: "Dashboard", to: "/dashboard", icon: "🏠", end: true },
    { label: "My Teams", to: "/dashboard/teams", icon: "👥" },
    { label: "Updates", to: "/dashboard/updates", icon: "🗂️" },
  ];

  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
        : "bg-white/5 hover:bg-white/15 hover:scale-[1.02] text-slate-200"
    }`;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-72 shrink-0 min-h-screen border-r border-white/10 bg-white/10 backdrop-blur-2xl p-5 flex flex-col">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight mb-6">🚀 Daily Standup</h1>

        <div className="mb-6 rounded-2xl bg-white/10 border border-white/15 p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-300">Signed in as</p>
              <p className="text-sm font-medium truncate">{email}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={logout}
        className="mt-auto px-4 py-3 rounded-xl bg-rose-500/90 hover:bg-rose-500 transition-all duration-300 hover:scale-[1.02] text-white font-medium shadow-lg shadow-rose-500/20"
      >
        Logout
      </button>
    </aside>
  );
}