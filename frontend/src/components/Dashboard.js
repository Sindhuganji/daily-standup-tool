import { useState } from 'react';

import api from '../services/api';

export default function Dashboard() {
  const [teamName, setTeamName] = useState("");
  const [joinTeamId, setJoinTeamId] = useState("");

  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");

  const [loadingCreateTeam, setLoadingCreateTeam] = useState(false);
  const [loadingJoinTeam, setLoadingJoinTeam] = useState(false);
  const [loadingSubmitUpdate, setLoadingSubmitUpdate] = useState(false);

  const createTeam = async () => {
    if (!teamName.trim()) return;
    try {
      setLoadingCreateTeam(true);
      await api.post("/team/create", { name: teamName.trim() });
      setTeamName("");
      alert("✅ Team created");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create team");
    } finally {
      setLoadingCreateTeam(false);
    }
  };

  const joinTeam = async () => {
    if (!joinTeamId.trim()) return;
    try {
      setLoadingJoinTeam(true);
      await api.post("/team/join", { teamId: joinTeamId.trim() });
      setJoinTeamId("");
      alert("✅ Joined team");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join team");
    } finally {
      setLoadingJoinTeam(false);
    }
  };

  const submitUpdate = async () => {
    try {
      setLoadingSubmitUpdate(true);
      await api.post("/update", { yesterday, today, blockers });
      setYesterday("");
      setToday("");
      setBlockers("");
      alert("✅ Update submitted");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit update");
    } finally {
      setLoadingSubmitUpdate(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Submit Daily Update */}
      <section className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">📝 Submit Daily Update</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <textarea
            value={yesterday}
            onChange={(e) => setYesterday(e.target.value)}
            placeholder="Yesterday"
            className="min-h-[120px] rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            value={today}
            onChange={(e) => setToday(e.target.value)}
            placeholder="Today"
            className="min-h-[120px] rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            placeholder="Blockers"
            className="min-h-[120px] rounded-xl bg-white/10 border border-white/20 p-3 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button
          onClick={submitUpdate}
          disabled={loadingSubmitUpdate}
          className="mt-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition-all duration-300 disabled:opacity-60"
        >
          {loadingSubmitUpdate ? "Submitting..." : "Submit Update"}
        </button>
      </section>

      {/* Team Management */}
      <section className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">👥 Team Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-slate-300 mb-2">Create Team</p>
            <div className="flex gap-2">
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className="flex-1 rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={createTeam}
                disabled={loadingCreateTeam}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all duration-300 disabled:opacity-60"
              >
                {loadingCreateTeam ? "..." : "Create"}
              </button>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-slate-300 mb-2">Join Team</p>
            <div className="flex gap-2">
              <input
                value={joinTeamId}
                onChange={(e) => setJoinTeamId(e.target.value)}
                placeholder="Enter team ID"
                className="flex-1 rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={joinTeam}
                disabled={loadingJoinTeam}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 disabled:opacity-60"
              >
                {loadingJoinTeam ? "..." : "Join"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}