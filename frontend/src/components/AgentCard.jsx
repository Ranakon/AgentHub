import { useNavigate } from "react-router-dom";

function AgentCard({ agent, isFavorite = false, onToggleFavorite }) {
  const navigate = useNavigate();
  const agentId = agent._id || agent.id;

  return (
    <div className="card">
      <div className="card-header">
        <span className="agent-badge">{agent.category}</span>
        {onToggleFavorite && (
          <button
            type="button"
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={() => onToggleFavorite(agentId)}
          >
            {isFavorite ? "?" : "?"}
          </button>
        )}
      </div>

      <div style={{ marginTop: "10px" }}>
        {(agent.tags || []).slice(0, 3).map((tag, index) => (
          <span
            key={index}
            style={{
              background: "#334155",
              padding: "5px 10px",
              margin: "5px",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      <h2>{agent.name}</h2>
      <p>{agent.description}</p>
      <p>? {Number(agent.rating || 0).toFixed(1)} | ?? {agent.usage ?? 0}</p>

      <button onClick={() => navigate(`/agentdetails/${agentId}`)}>Run</button>
    </div>
  );
}

export default AgentCard;
