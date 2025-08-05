const mongoose = require("mongoose")

const laneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Programming", "Frontend", "Backend", "Mobile", "AI/ML", "DevOps", "Design"],
    },
    impactScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    state: {
      type: String,
      enum: ["ok", "watchlist", "save", "archive"],
      default: "ok",
    },
    metrics: {
      views: { type: Number, default: 0 },
      completions: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
    },
    content: {
      description: String,
      difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
      estimatedTime: Number, // in minutes
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Lane", laneSchema)
