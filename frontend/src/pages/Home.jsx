import { useEffect, useState } from "react";
import axios from "axios";
import AgentCard from "../components/AgentCard";
import { useNavigate, Link } from "react-router-dom";
import Categories from "../components/Categories";

function Home() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };
  const [selected, setSelected] = useState("All");

  // fetch agents
  useEffect(() => {
    axios
      .get("https://agenthub-pwxn.onrender.com/api/agents")
      .then((res) => setAgents(res.data))
      .catch((err) => console.error(err));
  }, []);

  // filter agents based on search
  // const filteredAgents = agents.filter((agent) =>
  //   agent.name.toLowerCase().includes(search.toLowerCase()),
  // );
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = selected === "All" || agent.category === selected;

    return matchesSearch && matchesCategory;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  const navigate = useNavigate();

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span id="TitleHub">🚀 AgentHub</span>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="🔍 Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="profile-section">
          <div
            className="profile-trigger"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>{user.name}</span>
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          </div>

          {showDropdown && (
            <div className="dropdown-menu">
              {/* <button className="dropdown-item" onClick={handleLogout}>📋Dashboard</button> */}
              <button
                className="dropdown-item"
                onClick={() => navigate("/dashboard")}
              >
                📋 Dashboard
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Explore Agents</h2>
          <Link to="/add">
            <button>➕ New Agent</button>
          </Link>
        </div>
          <Categories selected={selected} setSelected={setSelected} />
        {/* AGENTS GRID */}
        <div className="grid">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                gridColumn: "1/-1",
                marginTop: "2rem",
              }}
            >
              No agents found matching "{search}" 😢
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
