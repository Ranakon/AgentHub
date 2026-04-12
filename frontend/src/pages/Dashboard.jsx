import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id && !user?.id) {
      return;
    }

    const userId = user._id || user.id;

    axios
      .get(`https://agenthub-pwxn.onrender.com/api/agents/user/${userId}`)
      .then((res) => setAgents(res.data))
      .catch((err) => {
        console.error(err);
        setAgents([]);
      });
  }, []);

  return (
    <div>
      <h2>My Agents 🤖</h2>

      {agents.length === 0 ? (
        <p>No agents yet 😢</p>
      ) : (
        agents.map((agent) => (
          <div key={agent.id}>
            <h3>{agent.name}</h3>
            <p>{agent.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
