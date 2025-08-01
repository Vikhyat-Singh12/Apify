import React, { useState } from "react";
import axios from "axios";
import.meta.env.VITE_BACKEND_URL


const DynamicForm = ({ apiKey, actorId, inputSchema, setOutput }) => {
  const [formData, setFormData] = useState(() => {
    const defaultValues = {};
    Object.entries(inputSchema.properties).forEach(([key, value]) => {
      if (value.default !== undefined) {
        defaultValues[key] = value.default;
      } else if (value.type === "array") {
        defaultValues[key] = [];
      } else {
        defaultValues[key] = "";
      }
    });
    return defaultValues;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e, key, index = null) => {
    const { value } = e.target;
    if (index !== null) {
      const updatedArray = [...formData[key]];
      updatedArray[index].url = value;
      setFormData((prev) => ({ ...prev, [key]: updatedArray }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const addArrayItem = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], { url: "" }],
    }));
  };

  const removeArrayItem = (key, index) => {
    const updated = [...formData[key]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"}/api/apify/schema`, {
        apiKey,
        actorId,
        input: formData,
      });
      setOutput(res.data);
    } catch (err) {
      console.error("Run error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to run actor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow rounded-lg">
      {Object.entries(inputSchema.properties).map(([key, prop]) => (
        <div key={key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {prop.title || key}
          </label>

          {["string", "number", "integer"].includes(prop.type) ? (
            <input
              type={["number", "integer"].includes(prop.type) ? "number" : "text"}
              value={formData[key]}
              onChange={(e) => handleChange(e, key)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${prop.title || key}`}
            />
          ) : prop.type === "array" && Array.isArray(formData[key]) ? (
            <div className="space-y-3">
              {formData[key].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => handleChange(e, key, index)}
                    placeholder="Enter URL"
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(key, index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                    title="Remove URL"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(key)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                + Add another URL
              </button>
            </div>
          ) : null}
        </div>
      ))}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Actor"}
      </button>
    </form>
  );
};

export default DynamicForm;
