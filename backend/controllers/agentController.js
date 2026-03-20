import fs from "fs";
import path from "path";
import { callGemini } from "../utils/gemini.js";


const filePath = path.resolve("data/agents.json");

// Get all agents
export const getAgents = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
};

// Add new agent
export const addAgent = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));

  const newAgent = {
    id: Date.now(),
    ...req.body,
    rating: 4.0,
    usage: 0
  };

  data.push(newAgent);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: "Agent added successfully", agent: newAgent });
};

// Run agent
export const runAgent = async (req, res) => {
  const { agentId } = req.body;
  const input = req.body.input || ""; // Default to empty string if undefined

  const data = JSON.parse(fs.readFileSync(filePath));
  const agent = data.find(a => a.id == agentId);

  if (!agent) return res.status(404).json({ error: "Agent not found" });

  try {
    let result;

    if (agent.apiUrl) {
      // Call external API
      const response = await fetch(agent.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      // Renamed to avoid shadowing the 'data' variable holding the agents list
      const apiData = await response.json();
      result = apiData.output || JSON.stringify(apiData);
    } else {
      // Use Gemini
      result = await callGemini(input);
    }

    // Increase usage
    agent.usage += 1;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ result });

  } catch (error) {
    console.error("Error running agent:", error);
    res.status(500).json({ error: error.message || "Error running agent" });
  }
};

// Ratings
export const rateAgent = (req, res) => {
  const { agentId, rating } = req.body;

  const data = JSON.parse(fs.readFileSync(filePath));
  const agent = data.find(a => a.id == agentId);

  if (!agent) return res.status(404).json({ error: "Agent not found" });

  // simple fake averaging
  agent.rating = ((agent.rating || 4) + rating) / 2;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: "Rating updated" });
};