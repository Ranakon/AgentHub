import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";


function AddAgent() {
    
const navigate = useNavigate();

useEffect(() => {
  const user = localStorage.getItem("user");
  if (!user) {
    navigate("/login");
  }
}, []);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    apiUrl: "",
    sampleInput: ""
  });

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const data = {
      ...form,
      tags: form.tags.split(","),
      userId: user._id
    };

    try {
      await axios.post("https://agenthub-pwxn.onrender.com/api/agents", data);
      alert("Agent added successfully!");
      navigate("/"); // Navigate back to home or dashboard
    } catch (error) {
      alert("Failed to add agent: " + (error.response?.data?.error || error.message));
    }
  };

  return (
   <div className="container">
  <div className="card-panel">
    <h2>Create New Agent</h2>

    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>

      <div className="form-group">
        <label>Agent Name</label>
        <input 
          required 
          placeholder="e.g. Code Reviewer"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} 
        />
      </div>
      <div className="form-group">
  <label>API URL (Optional)</label>
  <input 
    placeholder="https://your-api.com/run"
    value={form.apiUrl}
    onChange={e => setForm({...form, apiUrl: e.target.value})} 
  />
  <small style={{ color: "#94a3b8" }}>
    Leave empty to use built-in AI (Gemini)
  </small>
</div>

      <div className="form-group">
        <label>Description</label>
        <input 
          required 
          placeholder="What does this agent do?"
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})} 
        />
      </div>

      <div className="form-group">
        <label>Category & Tags</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          
          {/* --- Dropdown for Category --- */}
          <select 
            required
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
          >
            <option value="" disabled>Select Category</option>
            <option value="Productivity">Productivity</option>
            <option value="Development">Development</option>
            <option value="Research">Research</option>
            <option value="Creative">Creative</option>
          </select>

          <input 
            required 
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={e => setForm({...form, tags: e.target.value})} 
          />
        </div>
      </div>

      <div className="form-group">
        <label>Sample Input</label>
        <textarea 
          required 
          rows="4" 
          placeholder="Enter default text for users to test..."
          value={form.sampleInput}
          onChange={e => setForm({...form, sampleInput: e.target.value})} 
        />
      </div>

      <button type="submit" className="btn-block">Create Agent</button>
      
    </form>
  </div>
</div>
  );
}

export default AddAgent;