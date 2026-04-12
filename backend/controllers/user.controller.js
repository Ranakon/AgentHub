import User from "../models/user.model.js";
import mongoose from "mongoose";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ favorites: user.favorites || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { agentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ message: "Invalid user ID or agent ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFavorite = (user.favorites || []).some(
      (favId) => favId.toString() === agentId
    );

    if (alreadyFavorite) {
      user.favorites = user.favorites.filter((favId) => favId.toString() !== agentId);
    } else {
      user.favorites.push(agentId);
    }

    await user.save();

    res.json({
      isFavorite: !alreadyFavorite,
      favorites: user.favorites || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
