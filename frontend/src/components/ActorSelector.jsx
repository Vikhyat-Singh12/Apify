import React, { useState } from "react";
import axios from "axios";
import.meta.env.VITE_BACKEND_URL
import { Loader2, AlertTriangle } from "lucide-react"; 

const ActorSelector = ({
  actors,
  apiKey,
  setSelectedActor,
  setInputSchema,
  setOutput,
}) => {
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectChange = async (e) => {
    const actorId = e.target.value;
    setSelected(actorId);
    setSelectedActor(actorId);
    setInputSchema(null);
    setOutput(null);
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"}/api/apify/schema`, {
        apiKey,
        actorId,
      });
      setInputSchema(res.data.schema);
    } catch (err) {
      setInputSchema(null);
      setError(err.response?.data?.error || "Failed to fetch actor schema.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800">
        🎭 Choose an Apify Actor
      </label>

      <select
        value={selected}
        onChange={handleSelectChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        <option value="">-- Select an actor to configure --</option>
        {actors.map((actor) => (
          <option key={actor.id} value={actor.id}>
            {actor.name || actor.id}
          </option>
        ))}
      </select>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" /> Fetching schema...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}
    </div>
  );
};

export default ActorSelector;
