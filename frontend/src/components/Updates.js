import {
  useEffect,
  useState,
} from 'react';

import api from '../services/api';

export default function Updates() {
  const [updates, setUpdates] = useState([]);

  const fetchUpdates = async () => {
    try {
      const { data } = await api.get("/update");
      setUpdates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch updates error:", err);
      setUpdates([]);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  return (
    <section className="bg-white/10 border border-white/20 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">🗂 Team Updates</h2>

      {updates.length === 0 ? (
        <p>No updates yet</p>
      ) : (
        <div className="space-y-3">
          {updates.map((update) => {
            console.log("UPDATE OBJECT:", update); // debug
            return (
              <div key={update._id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                {/* ✅ fixed */}
                <h3 className="font-semibold">{update.userId?.name || "User"}</h3>
                <p>Yesterday: {update.yesterday || "-"}</p>
                <p>Today: {update.today || "-"}</p>
                <p>Blockers: {update.blockers || "-"}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}