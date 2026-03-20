import { useNavigate } from "react-router-dom";

function AgentCard({ agent }) {
  const navigate = useNavigate();

  return (
    
    <div className="card">
        <div style={{ marginTop: "10px" }}>
        {(agent.tags || []).map((tag, index) => (
          <span
            key={index}
            style={{
              background: "#334155",
              padding: "5px 10px",
              margin: "5px",
              borderRadius: "8px",
              fontSize: "12px"
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
      <h2>{agent.name}</h2>
      <p>{agent.creator || "Unknown"}</p>
      <p>{agent.description}</p>
      <p>⭐ {agent.rating ?? 0} | 👥 {agent.usage ?? 0}</p>

      <button onClick={() => navigate(`/agentdetails/${agent._id || agent.id}`)}>
        Run
      </button>
    </div>
  );
}

export default AgentCard;