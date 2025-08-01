import React, { useState } from "react";
import ApiKeyForm from "./components/ApiKeyForm";
import ActorSelector from "./components/ActorSelector";
import DynamicForm from "./components/DynamicForm";
import OutputViewer from "./components/OutputViewer";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [inputSchema, setInputSchema] = useState(null);
  const [output, setOutput] = useState(null);
  const [hasFetchedActors, setHasFetchedActors] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-purple-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8 md:p-10 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            🎬 Apify Actor Runner
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Dynamically run your Apify actors with customized input.
          </p>
        </div>

        <ApiKeyForm
          apiKey={apiKey}
          setApiKey={(val) => {
            setApiKey(val);
            setHasFetchedActors(false);
          }}
          setActors={setActors}
          setSelectedActor={setSelectedActor}
          setInputSchema={setInputSchema}
          setOutput={setOutput}
          setHasFetchedActors={setHasFetchedActors}
        />

        {actors.length > 0 ? (
          <ActorSelector
            actors={actors}
            apiKey={apiKey}
            selectedActor={selectedActor}
            setSelectedActor={setSelectedActor}
            setInputSchema={setInputSchema}
            setOutput={setOutput}
          />
        ) : (
          hasFetchedActors && (
            <div className="text-center mt-6 bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg">
              <p className="font-medium">No actors found on your Apify account.</p>
              <p className="text-sm mt-2">
                👉{" "}
                <a
                  href="https://console.apify.com/actors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  Click here to create a new actor on Apify.
                </a>
              </p>
            </div>
          )
        )}

        {inputSchema && selectedActor && (
          <DynamicForm
            apiKey={apiKey}
            actorId={selectedActor}
            inputSchema={inputSchema}
            setOutput={setOutput}
          />
        )}

        {output && <OutputViewer output={output} />}
      </div>
    </div>
  );
}

export default App;
