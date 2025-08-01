import React, { useState } from "react";
import { Code, ChevronDown, ChevronRight } from "lucide-react";

const OutputViewer = ({ output }) => {
  if (!output) return null;

  const CollapsibleObject = ({ obj, depth = 0 }) => {
    const [expanded, setExpanded] = useState(true);

    return (
      <div className={`space-y-2 pl-${depth * 2}`}>
        {Object.entries(obj).map(([key, value], index) => {
          const isNested = typeof value === "object" && value !== null;

          return (
            <div key={`${key}-${index}`}>
              <div
                className="flex items-start gap-2 cursor-pointer"
                onClick={() => isNested && setExpanded((prev) => !prev)}
              >
                {isNested ? (
                  expanded ? (
                    <ChevronDown className="w-4 h-4 mt-1 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mt-1 text-gray-500" />
                  )
                ) : (
                  <Code className="w-4 h-4 mt-1 text-gray-400" />
                )}
                <span className="font-medium text-blue-700 capitalize">{key}:</span>
              </div>

              {isNested ? (
                expanded && (
                  <div className="ml-6 bg-gray-50 border border-gray-200 rounded p-3 shadow-inner max-h-96 overflow-auto text-sm">
                    <CollapsibleObject obj={value} depth={depth + 1} />
                  </div>
                )
              ) : (
                <p className="ml-6 bg-gray-100 rounded p-2 text-gray-800 text-sm break-words">
                  {value?.toString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Code className="w-6 h-6 text-indigo-500" />
        Output
      </h2>
      <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-lg overflow-x-auto">
        <CollapsibleObject obj={output} />
      </div>
    </div>
  );
};

export default OutputViewer;
