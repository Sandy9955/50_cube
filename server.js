const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const methodOverride = require("method-override")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("express-flash")
const path = require("path")
require("dotenv").config()

const app = express()

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.stripe.com"],
        frameSrc: ["https://js.stripe.com"],
      },
    },
  }),
)

app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// View engine setup
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Static files
app.use(express.static(path.join(__dirname, "public")))

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "50cube-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/50cube",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
)

app.use(flash())

// Global middleware for template variables
app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  res.locals.messages = req.flash()
  next()
})

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/50cube", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/", require("./routes/index"))
app.use("/merch", require("./routes/merch"))
app.use("/admin", require("./routes/admin"))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error", {
    title: "Server Error",
    error: process.env.NODE_ENV === "development" ? err : { message: "Internal server error" },
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    error: { message: "The page you're looking for doesn't exist." },
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Visit: http://localhost:${PORT}`)
})
