const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    credits: {
      type: Number,
      default: 2500, // Demo credits
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
      firstName: String,
      lastName: String,
      avatar: String,
    },
    stats: {
      bursts: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      purchases: { type: Number, default: 0 },
      redemptions: { type: Number, default: 0 },
      referrals: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
