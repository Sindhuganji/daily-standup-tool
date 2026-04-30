import {
  useEffect,
  useState,
} from 'react';

import api from '../services/api';

export default function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinTeamId, setJoinTeamId] = useState("");
  const [joining, setJoining] = useState(false);

  const fetchTeams = async () => {
    try {
      const { data } = await api.get("/team/my");
      setTeams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH TEAMS ERROR:", error?.response?.data || error.message);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleJoinTeam = async () => {
    if (!joinTeamId.trim()) {
      alert("Please enter Team ID");
      return;
    }

    try {
      setJoining(true);
      const { data } = await api.post("/team/join", { teamId: joinTeamId.trim() });
      alert(data?.message || "Joined team successfully");
      setJoinTeamId("");
      await fetchTeams();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to join team");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">👥 Join Team Using Team ID</h2>
        <div className="flex gap-2">
          <input
            value={joinTeamId}
            onChange={(e) => setJoinTeamId(e.target.value)}
            placeholder="Enter Team ID"
            className="flex-1 rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleJoinTeam}
            disabled={joining}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 disabled:opacity-60"
          >
            {joining ? "..." : "Join"}
          </button>
        </div>
      </section>

      <section className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">📊 My Teams</h2>

        {loading ? (
          <p className="text-slate-300">Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="text-slate-300">No teams yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <div key={team._id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-indigo-200">{team.name}</p>
                <p className="text-xs text-slate-400 mt-1">ID: {team._id}</p>
                <p className="text-xs text-slate-300 mt-2">
                  Admin: {team.admin?.name || team.admin?.email || "N/A"}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Members: {team.members?.length || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}