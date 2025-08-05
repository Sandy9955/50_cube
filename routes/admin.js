const express = require("express")
const User = require("../models/User")
const Lane = require("../models/Lane")
const Redemption = require("../models/Redemption")

const router = express.Router()

// Middleware to check admin access
const requireAdmin = async (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Please log in to access admin area")
    return res.redirect("/login")
  }

  const user = await User.findById(req.session.user.id)
  if (!user || !user.isAdmin) {
    req.flash("error", "Admin access required")
    return res.redirect("/")
  }
  next()
}

// GET /admin/metrics - Admin metrics dashboard
router.get("/metrics", requireAdmin, async (req, res) => {
  try {
    const { since } = req.query
    const dateFilter = since ? { createdAt: { $gte: new Date(since) } } : {}

    // Aggregate metrics from users
    const users = await User.find(dateFilter)
    const redemptions = await Redemption.find(dateFilter)

    const metrics = users.reduce(
      (acc, user) => {
        acc.bursts += user.stats.bursts || 0
        acc.wins += user.stats.wins || 0
        acc.purchases += user.stats.purchases || 0
        acc.referrals += user.stats.referrals || 0
        return acc
      },
      { bursts: 0, wins: 0, purchases: 0, referrals: 0 },
    )

    metrics.redemptions = redemptions.length

    // Generate chart data for the last 30 days
    const chartData = []
    const now = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      chartData.push({
        date: date.toISOString().split("T")[0],
        bursts: Math.floor(Math.random() * 200) + 400,
        wins: Math.floor(Math.random() * 150) + 250,
        purchases: Math.floor(Math.random() * 50) + 70,
        redemptions: Math.floor(Math.random() * 30) + 40,
        referrals: Math.floor(Math.random() * 20) + 25,
      })
    }

    res.render("admin/metrics", {
      title: "Admin Metrics - 50cube",
      metrics: { ...metrics, chartData },
      since: since || "",
    })
  } catch (error) {
    console.error("Error fetching metrics:", error)
    req.flash("error", "Failed to fetch metrics")
    res.redirect("/")
  }
})

// GET /admin/lanes - Impact console
router.get("/lanes", requireAdmin, async (req, res) => {
  try {
    const { state } = req.query
    const filter = state && state !== "all" ? { state } : {}
    const lanes = await Lane.find(filter).sort({ impactScore: -1 })

    res.render("admin/lanes", {
      title: "Impact Console - 50cube",
      lanes,
      currentFilter: state || "all",
    })
  } catch (error) {
    console.error("Error fetching lanes:", error)
    req.flash("error", "Failed to fetch lanes")
    res.redirect("/")
  }
})

// POST /admin/lanes/:id/state - Update lane state
router.post("/lanes/:id/state", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { state } = req.body

    const validStates = ["ok", "watchlist", "save", "archive"]
    if (!validStates.includes(state)) {
      req.flash("error", "Invalid state")
      return res.redirect("/admin/lanes")
    }

    const lane = await Lane.findByIdAndUpdate(id, { state, updatedAt: new Date() }, { new: true })

    if (!lane) {
      req.flash("error", "Lane not found")
      return res.redirect("/admin/lanes")
    }

    req.flash("success", `Lane "${lane.name}" state updated to ${state}`)
    res.redirect("/admin/lanes")
  } catch (error) {
    console.error("Error updating lane state:", error)
    req.flash("error", "Failed to update lane state")
    res.redirect("/admin/lanes")
  }
})

module.exports = router
