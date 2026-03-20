import express from "express";
import {
  getAgents,
  addAgent,
  runAgent,
  rateAgent
} from "../controllers/agentController.js";

const router = express.Router();

router.get("/", getAgents);
router.post("/", addAgent);
router.post("/run", runAgent);
router.post("/rate", rateAgent);

export default router;