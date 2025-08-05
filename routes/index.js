const express = require("express")
const router = express.Router()

// Home page
router.get("/", (req, res) => {
  res.render("index", {
    title: "50cube Platform",
    description: "Interactive learning platform with gamified systems",
  })
})

// Login page
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/")
  }
  res.render("auth/login", {
    title: "Login - 50cube",
  })
})

// Register page
router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/")
  }
  res.render("auth/register", {
    title: "Register - 50cube",
  })
})

// Login POST
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const User = require("../models/User")

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      req.flash("error", "Invalid email or password")
      return res.redirect("/login")
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      credits: user.credits,
    }

    req.flash("success", "Welcome back!")
    res.redirect("/")
  } catch (error) {
    console.error("Login error:", error)
    req.flash("error", "Login failed. Please try again.")
    res.redirect("/login")
  }
})

// Register POST
router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match")
      return res.redirect("/register")
    }

    const User = require("../models/User")
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      req.flash("error", "Email already registered")
      return res.redirect("/register")
    }

    const user = new User({ email, password })
    await user.save()

    req.session.user = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      credits: user.credits,
    }

    req.flash("success", "Account created successfully!")
    res.redirect("/")
  } catch (error) {
    console.error("Registration error:", error)
    req.flash("error", "Registration failed. Please try again.")
    res.redirect("/register")
  }
})

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err)
    }
    res.redirect("/")
  })
})

module.exports = router
