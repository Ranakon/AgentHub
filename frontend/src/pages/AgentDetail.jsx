import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://agenthub-pwxn.onrender.com/api";

function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [agent, setAgent] = useState(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const submitRating = async (rating) => {
    setUserRating(rating);
    try {
      await axios.post(`${API_BASE}/agents/rate`, {
        agentId: id,
        rating,
      });
      setAgent((prev) => ({ ...prev, rating }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/users/${userId}/favorites/toggle`, {
        agentId: id,
      });
      const favorites = (res.data?.favorites || []).map((favId) => String(favId));
      setIsFavorite(favorites.includes(String(id)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setInitialLoading(true);
      try {
        const allReq = axios.get(`${API_BASE}/agents`);
        const agentReq = axios.get(`${API_BASE}/agents/${id}`);
        const favReq = userId
          ? axios.get(`${API_BASE}/users/${userId}/favorites`)
          : Promise.resolve({ data: { favorites: [] } });

        const [allRes, oneRes, favRes] = await Promise.all([allReq, agentReq, favReq]);
        setAgents(allRes.data || []);
        setAgent(oneRes.data || null);
        setInput(oneRes.data?.sampleInput || "");

        const favorites = (favRes.data?.favorites || []).map((favId) => String(favId));
        setIsFavorite(favorites.includes(String(id)));
      } catch (err) {
        console.error(err);
        setAgent(null);
      } finally {
        setInitialLoading(false);
      }
    };

    load();
  }, [id, userId]);

  const runAgent = async () => {
    setLoading(true);
    setOutput("");

    const agentId = agent?._id || agent?.id || id;
    if (!agentId) {
      setOutput("Error running agent: missing agent ID");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/agents/run`, {
        agentId,
        input,
      });
      setOutput(res.data.result);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Error running agent";
      setOutput(`Error running agent: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container">
        <div className="loader">
          <div className="spinner" />
          <p>Loading agent workspace...</p>
        </div>
      </div>
    );
  }

  if (!agent) return <p>Agent not found.</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "250px", background: "#1e293b", padding: "20px", overflowY: "auto" }}>
        <h3
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", marginBottom: "20px", transition: "0.3s" }}
          onMouseOver={(e) => (e.target.style.color = "#3b82f6")}
          onMouseOut={(e) => (e.target.style.color = "white")}
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
                background: String(agentId) === String(id) ? "#3b82f6" : "#334155",
              }}
            >
              {a.name}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        <div className="detail-head">
          <div>
            <h2>{agent.name}</h2>
            <p>{agent.description}</p>
            <p>? {Number(agent.rating || 0).toFixed(1)} ({agent.usage || 0} runs)</p>
          </div>
          <button type="button" className={`favorite-btn ${isFavorite ? "active" : ""}`} onClick={toggleFavorite}>
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>

        {output && (
          <div style={{ marginTop: "20px" }}>
            <h3>Rate this agent</h3>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => submitRating(star)}
                style={{ fontSize: "28px", cursor: "pointer", color: star <= userRating ? "gold" : "#475569", marginRight: "5px" }}
              >
                ?
              </span>
            ))}
          </div>
        )}

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "100%", height: "150px", padding: "10px", borderRadius: "8px", marginTop: "10px" }}
        />

        <button onClick={runAgent} style={{ marginTop: "10px" }} disabled={loading}>
          {loading ? "Running..." : "Run"}
        </button>

        {loading ? (
          <div className="loader pulse-loader">
            <div className="spinner" />
            <p>Thinking and composing output...</p>
          </div>
        ) : (
          <pre className="output-box">{output}</pre>
        )}
      </div>
    </div>
  );
}

export default AgentDetail;
