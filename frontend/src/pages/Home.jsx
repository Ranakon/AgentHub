import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AgentCard from "../components/AgentCard";
import AgentCardSkeleton from "../components/AgentCardSkeleton";
import { useNavigate, Link } from "react-router-dom";
import Categories from "../components/Categories";

const API_BASE = "https://agenthub-pwxn.onrender.com/api";

function Home() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [viewMode, setViewMode] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };
  const userId = user?._id || user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const agentsReq = axios.get(`${API_BASE}/agents`);
        const favoritesReq = userId
          ? axios.get(`${API_BASE}/users/${userId}/favorites`)
          : Promise.resolve({ data: { favorites: [] } });

        const [agentsRes, favoritesRes] = await Promise.all([agentsReq, favoritesReq]);
        setAgents(agentsRes.data || []);
        setFavoriteIds((favoritesRes.data?.favorites || []).map((id) => String(id)));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleToggleFavorite = async (agentId) => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/users/${userId}/favorites/toggle`, {
        agentId,
      });
      setFavoriteIds((res.data?.favorites || []).map((id) => String(id)));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAgents = useMemo(() => {
    const base = (agents || []).filter((agent) => {
      const matchesSearch = (agent.name || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selected === "All" || agent.category === selected;
      const isFavorite = favoriteIds.includes(String(agent._id || agent.id));
      const matchesView = viewMode === "all" || isFavorite;
      return matchesSearch && matchesCategory && matchesView;
    });

    const sorted = [...base];
    if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      sorted.sort((a, b) => (b.usage || 0) - (a.usage || 0));
    }

    return sorted;
  }, [agents, favoriteIds, search, selected, sortBy, viewMode]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <span id="TitleHub"><span className="neon-icon">◉</span> AgentHub</span>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="profile-section">
          <div className="profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
            <span>{user.name}</span>
            <div className="avatar">{(user.name || "G").charAt(0).toUpperCase()}</div>
          </div>

          {showDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => navigate("/dashboard")}>
                Dashboard
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Explore Agents</h2>
          <Link to="/add">
            <button>+ New Agent</button>
          </Link>
        </div>

        <div className="home-controls">
          <Categories selected={selected} setSelected={setSelected} />
          <div className="control-right">
            <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <option value="all">All Agents</option>
              <option value="favorites">Favorites</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="trending">Sort: Trending</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>
        </div>

        <div className="grid">
          {isLoading && Array.from({ length: 6 }).map((_, idx) => <AgentCardSkeleton key={idx} />)}
          {!isLoading && filteredAgents.length > 0 &&
            filteredAgents.map((agent) => {
              const agentId = String(agent._id || agent.id);
              return (
                <AgentCard
                  key={agentId}
                  agent={agent}
                  isFavorite={favoriteIds.includes(agentId)}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            })}
          {!isLoading && filteredAgents.length === 0 && (
            <p style={{ textAlign: "center", gridColumn: "1/-1", marginTop: "2rem" }}>
              No agents found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
