import axios from "axios";

export const getActors = async (req, res) => {
    const { apiKey } = req.body;
    try {
        const response = await axios.get(`https://api.apify.com/v2/acts?token=${apiKey}`);
        const actors = response.data.data.items;
        res.json(actors);
    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            res.status(403).json({
                error: "Invalid API Key",
                details: error.response.data?.error?.message || "Unauthorized access"
            });
        } else {
            res.status(400).json({
                error: "Failed to fetch actors",
                details: error.message
            });
        }
    }
};


export const getActorSchema = async (req, res) => {
  const { apiKey, actorId } = req.body;

  try {
    const actorPath = actorId.replace('/', '~');
    const response = await axios.get(`https://api.apify.com/v2/acts/${actorPath}?token=${apiKey}`);
    const data = response.data?.data;

    if (!data) {
      return res.status(404).json({ error: "Actor not found or no data available." });
    }

    if (data?.inputSchema) {
      return res.json({ type: "schema", schema: data.inputSchema });
    }

    if (data?.exampleRunInput?.body) {
      try {
        const parsed = JSON.parse(data.exampleRunInput.body);

        let startUrlsValue = [];
        if (Array.isArray(parsed.startUrls)) {
          startUrlsValue = parsed.startUrls.map(item => ({ url: item.url || "" }));
        }

        const enrichedSchema = {
          type: "object",
          properties: {
            startUrls: {
              type: "array",
              title: "Start URLs",
              description: "List of URLs to start crawling from.",
              items: {
                type: "object",
                properties: {
                  url: {
                    type: "string",
                    title: "URL",
                  },
                },
              },
              default: startUrlsValue,
            },
            maxDepth: {
              type: "integer",
              title: "Max Depth",
              default: 1,
            },
          },
          required: ["startUrls"],
        };

        return res.json({ type: "schema", schema: enrichedSchema });
      } catch (e) {
        return res.status(404).json({ error: "No input schema and invalid example input found." });
      }
    }

    return res.status(404).json({ error: "No input schema or example input available." });

  } catch (error) {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      return res.status(403).json({
        error: "Invalid API Key",
        details: error.response?.data?.error?.message || "Unauthorized access"
      });
    } else if (status === 404) {
      return res.status(404).json({
        error: "Invalid Actor ID",
        details: "No actor found for the given actorId."
      });
    } else {
      return res.status(400).json({
        error: "Failed to fetch schema",
        details: error.message
      });
    }
  }
};


export const runActor = async (req, res) => {
    const { apiKey, actorId, input } = req.body;
    try {
        const actorPath = actorId.replace('/', '~');
        const run = await axios.post(
        `https://api.apify.com/v2/acts/${actorPath}/runs?token=${apiKey}`,
        {
            input, 
            build: 'latest',
            memory: 1024,
            timeoutSecs: 120
        },
        {
            headers: {
            'Content-Type': 'application/json'
            }
        }
        );
        // console.log("Run initiated:", run.data);
        const runId = run.data.data.id;
        const pollResult = await axios.get(`https://api.apify.com/v2/actor-runs/${runId}/wait-for-finish?token=${apiKey}`);

        // console.log("Run result:", pollResult.data);

        res.json(pollResult.data.data.output || { message: "No output returned." });
    } catch (error) {
    // console.error("Apify Error:", error.response?.data || error.message);

    // If Apify fails, return dummy result
    const dummyOutput = {
        pages: [
            {
                url: "https://apify.com",
                title: "Apify · Web scraping and automation platform"
            }
        ],
        message: "This is dummy output because actor failed to run.",
        error: error.response?.data?.error || "An error occurred while running the actor."
    };

    res.status(200).json(dummyOutput);
}

}