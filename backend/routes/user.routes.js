import express from "express";
import {
  registerUser,
  loginUser,
  getFavorites,
  toggleFavorite,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:userId/favorites", getFavorites);
router.post("/:userId/favorites/toggle", toggleFavorite);

export default router;
