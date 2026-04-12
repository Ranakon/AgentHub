import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AgentCard from "../components/AgentCard";
import AgentCardSkeleton from "../components/AgentCardSkeleton";

const API_BASE = "https://agenthub-pwxn.onrender.com/api";

function Dashboard() {
  const [myAgents, setMyAgents] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  useEffect(() => {
    const loadDashboard = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [mineRes, allRes, favRes] = await Promise.all([
          axios.get(`${API_BASE}/agents/user/${userId}`),
          axios.get(`${API_BASE}/agents`),
          axios.get(`${API_BASE}/users/${userId}/favorites`),
        ]);

        setMyAgents(mineRes.data || []);
        setAllAgents(allRes.data || []);
        setFavoriteIds((favRes.data?.favorites || []).map((id) => String(id)));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [userId]);

  const favoriteAgents = useMemo(() => {
    return allAgents.filter((agent) => favoriteIds.includes(String(agent._id || agent.id)));
  }, [allAgents, favoriteIds]);

  if (!userId) {
    return (
      <div className="container">
        <h2>Dashboard</h2>
        <p>Please login to view your dashboard.</p>
        <Link to="/login">
          <button>Go to Login</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Product Dashboard</h2>

      <div className="stats-row">
        <div className="stat-card">
          <h3>{myAgents.length}</h3>
          <p>Agents Created</p>
        </div>
        <div className="stat-card">
          <h3>{favoriteIds.length}</h3>
          <p>Saved Agents</p>
        </div>
        <div className="stat-card">
          <h3>{myAgents.reduce((sum, a) => sum + (a.usage || 0), 0)}</h3>
          <p>Total Runs</p>
        </div>
      </div>

      <h3>Your Agents</h3>
      <div className="grid">
        {isLoading && Array.from({ length: 3 }).map((_, idx) => <AgentCardSkeleton key={`my-${idx}`} />)}
        {!isLoading && myAgents.length === 0 && <p>You have not created any agents yet.</p>}
        {!isLoading && myAgents.map((agent) => <AgentCard key={agent._id || agent.id} agent={agent} />)}
      </div>

      <h3>Saved Agents</h3>
      <div className="grid">
        {isLoading && Array.from({ length: 3 }).map((_, idx) => <AgentCardSkeleton key={`fav-${idx}`} />)}
        {!isLoading && favoriteAgents.length === 0 && <p>No favorites yet. Save agents from Home.</p>}
        {!isLoading && favoriteAgents.map((agent) => <AgentCard key={agent._id || agent.id} agent={agent} isFavorite />)}
      </div>
    </div>
  );
}

export default Dashboard;
