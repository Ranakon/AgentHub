import express from "express";
import {
  getAgents,
  createAgent,
  getAgentById,
  getAgentsByUser,
  runAgent,
  rateAgent,
} from "../controllers/agent.controller.js";

const router = express.Router();

router.get("/", getAgents);
router.post("/", createAgent);
router.post("/run", runAgent);
router.post("/rate", rateAgent);
router.get("/:id", getAgentById);
router.get("/user/:userId", getAgentsByUser);

export default router;