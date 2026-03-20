import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });

      // Store user data in localStorage and navigate to login
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🚀 AgentHub</h1>
        <p>Create your account</p>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <button
          className="ghost-btn"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Register;