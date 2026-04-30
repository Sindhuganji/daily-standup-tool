import { useState } from 'react';

import api from '../services/api';

export default function JoinTeamExample() {
  const [teamId, setTeamId] = useState("");

  const handleJoin = async () => {
    try {
      // if using api instance with interceptor:
      const res = await api.post("/team/join", { teamId });

      // if using raw axios, must pass Bearer token in headers:
      // await axios.post("http://localhost:5000/api/team/join", { teamId }, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      // });

      alert(res.data.message || "Joined team successfully");
    } catch (error) {
      console.error("JOIN TEAM FRONTEND ERROR:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Failed to join team");
    }
  };

  return (
    <div>
      <input
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
        placeholder="Enter Team ID"
      />
      <button onClick={handleJoin}>Join Team</button>
    </div>
  );
}