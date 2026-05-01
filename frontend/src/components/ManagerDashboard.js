import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // replace prevents returning to dashboard via back button history
    navigate("/login", { replace: true });
  };

  const fetchManagerUpdates = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/manager/updates");
      setUpdates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("MANAGER UPDATES ERROR:", error?.response?.data || error.message);

      // If token expired/invalid/forbidden, force logout to protect manager routes
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Header Bar */}
        <header className="mb-8">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Manager Dashboard
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base">
                Monitor team updates and blockers
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold
                         bg-gradient-to-r from-red-500 to-pink-500
                         shadow-lg shadow-red-500/20
                         transition-all duration-300
                         hover:scale-[1.03] hover:shadow-xl hover:shadow-pink-500/25
                         active:scale-[0.98]"
            >
              <span className="text-sm">⎋</span>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="grid place-items-center py-20">
            <div className="text-slate-300">Loading...</div>
          </div>
        ) : updates.length === 0 ? (
          <div className="grid place-items-center py-20">
            <div className="text-slate-400">No updates available</div>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.map((u) => {
              const userName = u.userId?.name || u.userId?.email || "User";
              const teamName = u.teamId?.name || "Team";
              const hasBlockers = Boolean(u.blockers && u.blockers.trim());

              return (
                <article
                  key={u._id}
                  className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-xl
                             transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold truncate">{userName}</h2>
                      <p className="text-xs text-slate-300 mt-1 truncate">{teamName}</p>
                    </div>

                    {hasBlockers && (
                      <span className="shrink-0 text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-red-500/15 border border-red-400/30 text-red-300">
                        BLOCKER
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                      <p className="text-xs text-slate-300 mb-1">Yesterday</p>
                      <p className="text-slate-100 leading-relaxed">
                        {u.yesterday?.trim() ? u.yesterday : "-"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                      <p className="text-xs text-slate-300 mb-1">Today</p>
                      <p className="text-slate-100 leading-relaxed">
                        {u.today?.trim() ? u.today : "-"}
                      </p>
                    </div>

                    {hasBlockers && (
                      <div className="text-red-400 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2 mt-2">
                        <div className="flex items-start gap-2">
                          <span className="mt-[2px]">⚠</span>
                          <div>
                            <p className="text-xs font-semibold text-red-300">Blockers</p>
                            <p className="text-sm leading-relaxed">{u.blockers}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : ""}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}