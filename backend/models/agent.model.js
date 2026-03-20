import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Productivity", "Development", "Research", "Creative"],
      required: true,
    },

    tags: [{
      type: String,
    }],

    apiUrl: {
      type: String,
      default: "",
    },

    sampleInput: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    usage: {
      type: Number,
      default: 0,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Agent", agentSchema);