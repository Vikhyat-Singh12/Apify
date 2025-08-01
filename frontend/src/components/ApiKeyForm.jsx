import React, { useState } from "react";
import axios from "axios";
import.meta.env.VITE_BACKEND_URL


const ApiKeyForm = ({
  apiKey,
  setApiKey,
  setActors,
  setSelectedActor,
  setInputSchema,
  setOutput,
  setHasFetchedActors,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchActors = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setHasFetchedActors(false);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"}/api/apify/actors`, { apiKey });
      setActors(res.data);
      setSelectedActor(null);
      setInputSchema(null);
      setOutput(null);
    } catch (err) {
      setActors([]);
      setError(err.response?.data?.error || "❌ Failed to fetch actors.");
    } finally {
      setHasFetchedActors(true);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFetchActors} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
      <div>
        <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700 mb-1">
          🔑 Apify API Key
        </label>
        <input
          id="apiKey"
          type="text"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setError("");
          }}
          placeholder="Enter your Apify API key..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`px-6 py-2 rounded-md text-white font-medium transition duration-200 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch My Actors"}
        </button>
      </div>

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded text-sm">
          ⚠️ {error}
        </div>
      )}
    </form>
  );
};

export default ApiKeyForm;
