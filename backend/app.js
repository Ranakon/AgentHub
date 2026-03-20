import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import agentRoutes from "./routes/agent.routes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/agents", agentRoutes);

export default app;