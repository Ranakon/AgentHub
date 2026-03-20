import Agent from "../models/agent.model.js";
import { callGemini } from "../utils/gemini.js";

export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const createAgent = async (req, res) => {
  try {
    const { name, description, category, tags, apiUrl, sampleInput, userId } = req.body;

    const agent = new Agent({
      name,
      description,
      category,
      tags: tags || [],
      apiUrl: apiUrl || "",
      sampleInput: sampleInput || "",
      userId,
    });

    await agent.save();

    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAgentsByUser = async (req, res) => {
  try {
    const agents = await Agent.find({ userId: req.params.userId });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const runAgent = async (req, res) => {
  const { agentId, input } = req.body;

  console.log("[runAgent] received", { agentId, input });

  if (!agentId) {
    return res.status(400).json({ error: "agentId is required" });
  }

  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    let output;
    if (agent.apiUrl) {
      const response = await fetch(agent.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const apiData = await response.json();
      output = apiData.output || JSON.stringify(apiData);
    } else {
      try {
        output = await callGemini(input);
      } catch (geminiErr) {
        console.warn("Gemini run fallback:", geminiErr.message);
        output = `Gemini unavailable (falling back): ${geminiErr.message}. Here is a basic echo output: ${input}`;
      }
    }

    agent.usage = (agent.usage || 0) + 1;
    await agent.save();

    res.json({ result: output });
  } catch (err) {
    console.error("Error running agent:", err);
    res.status(500).json({ error: err.message || "Error running agent" });
  }
};

export const rateAgent = async (req, res) => {
  const { agentId, rating } = req.body;

  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    agent.rating = ((agent.rating || 4) + rating) / 2;
    await agent.save();
    res.json({ message: "Rating updated" });
  } catch (err) {
    console.error("Error rating agent:", err);
    res.status(500).json({ error: err.message || "Error rating agent" });
  }
};