import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [agent, setAgent] = useState(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const submitRating = async (rating) => {
  setUserRating(rating);

  await axios.post("http://localhost:5000/api/agents/rate", {
    agentId: id,
    rating
  });
};

  useEffect(() => {
    // Load all agents for sidebar
    axios.get("http://localhost:5000/api/agents")
      .then(res => setAgents(res.data))
      .catch(err => console.error(err));

    // Load selected agent from backend by ID
    axios.get(`http://localhost:5000/api/agents/${id}`)
      .then(res => {
        setAgent(res.data);
        setInput(res.data?.sampleInput || "");
      })
      .catch(err => {
        console.error(err);
        setAgent(null);
      });
  }, [id]);

  const runAgent = async () => {
  setLoading(true);   // 🔥 start loading
  setOutput("");

  const agentId = agent?._id || agent?.id || id;

  if (!agentId) {
    setOutput("Error running agent: missing agent ID");
    setLoading(false);
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/agents/run", {
      agentId,
      input
    });

    setOutput(res.data.result);
  } catch (err) {
    const msg = err.response?.data?.error || err.message || "Error running agent 😢";
    setOutput(`Error running agent: ${msg}`);
  }

  setLoading(false);  // 🔥 stop loading
};

  if (!agent) return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* 🔥 SIDEBAR */}
      <div style={{
        width: "250px",
        background: "#1e293b",
        padding: "20px",
        overflowY: "auto"
      }}>
<h3
  onClick={() => navigate("/")}
  style={{
    cursor: "pointer",
    marginBottom: "20px",
    transition: "0.3s"
  }}
  onMouseOver={(e) => e.target.style.color = "#3b82f6"}
  onMouseOut={(e) => e.target.style.color = "white"}
>
  Agents
</h3>

        {agents.map((a) => {
          const agentId = a._id || a.id;
          return (
            <div
              key={agentId}
              onClick={() => navigate(`/agentdetails/${agentId}`)}
              style={{
                padding: "10px",
                margin: "10px 0",
                borderRadius: "8px",
                cursor: "pointer",
                background: agentId === id ? "#3b82f6" : "#334155"
              }}
            >
              {a.name}
            </div>
          );
        })}
      </div>

      {/* 💖 MAIN CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>{agent.name}</h2>
        <p>{agent.description}</p>
        <p>⭐ {agent.rating} ({agent.usage} users)</p>
        {output && (
  <div style={{ marginTop: "20px" }}>
    <h3>Rate this agent</h3>

    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => submitRating(star)}
        style={{
          fontSize: "28px",
          cursor: "pointer",
          color: star <= userRating ? "gold" : "#475569",
          marginRight: "5px"
        }}
      >
        ★
      </span>
    ))}
  </div>
)}
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            width: "100%",
            height: "150px",
            padding: "10px",
            borderRadius: "8px",
            marginTop: "10px"
          }}
        />

        <button onClick={runAgent} style={{ marginTop: "10px" }}>
          Run
        </button>

        {loading ? (
  <div className="loader">
    <div className="spinner"></div>
    <p>Thinking like an AI... 🤖</p>
  </div>
) : (
  <pre className="output-box">{output}</pre>
  
)}



      </div>
    </div>
  );
}

export default AgentDetail;