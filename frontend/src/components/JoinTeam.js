import { useEffect } from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import api from '../services/api';

function JoinTeam() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const join = async () => {
      try {
        if (!localStorage.getItem("token")) {
          alert("Please login first");
          return navigate("/login");
        }

        await api.post("/teams/join", { teamId });
        alert("✅ Joined team");
        navigate("/dashboard");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to join team");
        navigate("/dashboard");
      }
    };

    if (teamId) join();
  }, [teamId, navigate]);

  return <div style={{ padding: 20 }}>Joining team...</div>;
}

export default JoinTeam;