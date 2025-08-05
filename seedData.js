const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Product = require("./models/Product")
const Lane = require("./models/Lane")
const User = require("./models/User")
require("dotenv").config()

const seedProducts = [
  {
    name: "50cube Logo T-Shirt",
    description: "Premium cotton t-shirt with 50cube logo",
    price: 29.99,
    category: "Apparel",
    image: "/images/tshirt.jpg",
  },
  {
    name: "Learning Champion Mug",
    description: "Ceramic mug for your daily motivation",
    price: 19.99,
    category: "Drinkware",
    image: "/images/mug.jpg",
  },
  {
    name: "Premium Learning Hoodie",
    description: "Comfortable hoodie for focused study sessions",
    price: 59.99,
    category: "Apparel",
    image: "/images/hoodie.jpg",
  },
  {
    name: "Knowledge Journal",
    description: "High-quality notebook for taking notes",
    price: 24.99,
    category: "Stationery",
    image: "/images/notebook.jpg",
  },
  {
    name: "50cube Sticker Pack",
    description: "Collection of motivational stickers",
    price: 9.99,
    category: "Accessories",
    image: "/images/stickers.jpg",
  },
  {
    name: "Study Companion Backpack",
    description: "Durable backpack for students and learners",
    price: 79.99,
    category: "Bags",
    image: "/images/backpack.jpg",
  },
]

const seedLanes = [
  {
    name: "JavaScript Fundamentals",
    category: "Programming",
    impactScore: 85,
    state: "ok",
    metrics: { views: 12450, completions: 8930, engagement: 72 },
  },
  {
    name: "React Basics",
    category: "Frontend",
    impactScore: 78,
    state: "ok",
    metrics: { views: 9870, completions: 6540, engagement: 66 },
  },
  {
    name: "Database Design",
    category: "Backend",
    impactScore: 45,
    state: "watchlist",
    metrics: { views: 3420, completions: 1230, engagement: 36 },
  },
  {
    name: "Advanced CSS",
    category: "Frontend",
    impactScore: 92,
    state: "save",
    metrics: { views: 15670, completions: 12340, engagement: 79 },
  },
  {
    name: "Legacy PHP Course",
    category: "Backend",
    impactScore: 23,
    state: "archive",
    metrics: { views: 890, completions: 234, engagement: 26 },
  },
  {
    name: "Python for Beginners",
    category: "Programming",
    impactScore: 88,
    state: "ok",
    metrics: { views: 18920, completions: 14560, engagement: 77 },
  },
  {
    name: "Mobile App Development",
    category: "Mobile",
    impactScore: 67,
    state: "watchlist",
    metrics: { views: 7650, completions: 4320, engagement: 56 },
  },
  {
    name: "Machine Learning Intro",
    category: "AI/ML",
    impactScore: 94,
    state: "save",
    metrics: { views: 22340, completions: 18920, engagement: 85 },
  },
]

const seedUsers = [
  {
    email: "admin@50cube.com",
    password: "admin123",
    isAdmin: true,
    credits: 5000,
    profile: {
      firstName: "Admin",
      lastName: "User",
    },
    stats: {
      bursts: 1500,
      wins: 890,
      purchases: 234,
      redemptions: 125,
      referrals: 89,
    },
  },
  {
    email: "user@50cube.com",
    password: "user123",
    isAdmin: false,
    credits: 2500,
    profile: {
      firstName: "Demo",
      lastName: "User",
    },
    stats: {
      bursts: 450,
      wins: 230,
      purchases: 45,
      redemptions: 12,
      referrals: 8,
    },
  },
]

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/50cube")

    // Clear existing data
    await Product.deleteMany({})
    await Lane.deleteMany({})
    await User.deleteMany({})

    // Insert seed data
    await Product.insertMany(seedProducts)
    await Lane.insertMany(seedLanes)

    // Create users with hashed passwords
    for (const userData of seedUsers) {
      const user = new User(userData)
      await user.save()
    }

    console.log("Database seeded successfully!")
    console.log("Demo accounts:")
    console.log("Admin: admin@50cube.com / admin123")
    console.log("User: user@50cube.com / user123")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
