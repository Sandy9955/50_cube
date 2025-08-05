const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    credits: {
      type: Number,
      default: 2500, // Starting credits
      min: 0,
    },
    pendingCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profile: {
      avatar: String,
      phone: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    stats: {
      bursts: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      purchases: { type: Number, default: 0 },
      redemptions: { type: Number, default: 0 },
      referrals: { type: Number, default: 0 },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("User", userSchema)
