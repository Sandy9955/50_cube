const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Product = require("./models/Product")
const Lane = require("./models/Lane")
const User = require("./models/User")
require("dotenv").config()

const seedProducts = [
  {
    name: "50Cube Premium T-Shirt",
    description: "Comfortable cotton t-shirt with 50Cube branding. Perfect for developers and tech enthusiasts.",
    price: 29.99,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    features: ["Premium cotton", "50Cube branding", "Comfortable fit", "Multiple sizes"],
    inStock: true,
    inventory: 100,
    rating: {
      average: 4.5,
      count: 23
    }
  },
  {
    name: "50Cube Coffee Mug",
    description: "Ceramic coffee mug with 50Cube logo. Perfect for your morning coding sessions.",
    price: 19.99,
    category: "Drinkware",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    features: ["350ml capacity", "Microwave safe", "50Cube branding", "Dishwasher safe"],
    inStock: true,
    inventory: 150,
    rating: {
      average: 4.8,
      count: 45
    }
  },
  {
    name: "50Cube Hoodie",
    description: "Comfortable hoodie with 50Cube branding. Perfect for late-night coding sessions.",
    price: 59.99,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    features: ["Fleece lining", "Kangaroo pocket", "50Cube branding", "Comfortable fit"],
    inStock: true,
    inventory: 75,
    rating: {
      average: 4.7,
      count: 18
    }
  },
  {
    name: "50Cube Notebook",
    description: "High-quality notebook with 50Cube branding. Perfect for taking notes and sketching ideas.",
    price: 24.99,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400&h=400&fit=crop",
    features: ["200 pages", "Premium paper", "50Cube branding", "Spiral binding"],
    inStock: true,
    inventory: 200,
    rating: {
      average: 4.6,
      count: 32
    }
  },
  {
    name: "50Cube Sticker Pack",
    description: "Collection of 50Cube branded stickers. Perfect for laptops, water bottles, and more.",
    price: 9.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
    features: ["10 stickers", "High quality vinyl", "50Cube branding", "Various designs"],
    inStock: true,
    inventory: 300,
    rating: {
      average: 4.4,
      count: 67
    }
  },
  {
    name: "50Cube Backpack",
    description: "Durable backpack with 50Cube branding. Perfect for carrying your laptop and essentials.",
    price: 79.99,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    features: ["Laptop compartment", "Water resistant", "50Cube branding", "Ergonomic design"],
    inStock: true,
    inventory: 50,
    rating: {
      average: 4.9,
      count: 28
    }
  },
  {
    name: "50Cube Wireless Headphones",
    description: "Premium noise-canceling headphones with 50Cube branding. Perfect for focused work sessions.",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    features: ["Noise cancellation", "30-hour battery", "50Cube branding", "Premium sound"],
    inStock: true,
    inventory: 40,
    rating: {
      average: 4.9,
      count: 342
    }
  },
  {
    name: "50Cube Mechanical Keyboard",
    description: "RGB mechanical keyboard with 50Cube branding. Customizable backlighting and macro keys.",
    price: 149.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    features: ["Cherry MX switches", "RGB backlighting", "50Cube branding", "Premium build"],
    inStock: true,
    inventory: 30,
    rating: {
      average: 4.7,
      count: 178
    }
  },
  {
    name: "50Cube Laptop Stand",
    description: "Adjustable aluminum laptop stand with 50Cube branding. Ergonomic design for better posture.",
    price: 39.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
    features: ["Adjustable height", "Cooling vents", "50Cube branding", "Aluminum build"],
    inStock: true,
    inventory: 80,
    rating: {
      average: 4.6,
      count: 198
    }
  },
  {
    name: "50Cube Smart Watch",
    description: "Fitness tracking smartwatch with 50Cube branding. Heart rate monitor, GPS, and 7-day battery life.",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    features: ["Heart rate monitor", "GPS tracking", "50Cube branding", "Water resistant"],
    inStock: true,
    inventory: 25,
    rating: {
      average: 4.7,
      count: 312
    }
  },
  {
    name: "50Cube Wireless Mouse",
    description: "Ergonomic wireless mouse with 50Cube branding. Precision tracking and customizable buttons.",
    price: 59.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    features: ["Ergonomic design", "Precision tracking", "50Cube branding", "Long battery"],
    inStock: true,
    inventory: 60,
    rating: {
      average: 4.5,
      count: 167
    }
  },
  {
    name: "50Cube Desk Lamp",
    description: "LED desk lamp with 50Cube branding. Adjustable brightness and color temperature for optimal lighting.",
    price: 44.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    features: ["Adjustable brightness", "Color temperature", "50Cube branding", "Energy efficient"],
    inStock: true,
    inventory: 70,
    rating: {
      average: 4.4,
      count: 223
    }
  }
]

// Sample lanes data
const sampleLanes = [
  {
    name: "JavaScript Fundamentals",
    category: "Programming",
    impactScore: 85,
    state: "ok",
    metrics: {
      views: 12450,
      completions: 8930,
      engagement: 72
    },
    content: {
      description: "Learn the basics of JavaScript programming language",
      difficulty: "beginner",
      estimatedTime: 45
    }
  },
  {
    name: "React Basics",
    category: "Frontend",
    impactScore: 78,
    state: "ok",
    metrics: {
      views: 9870,
      completions: 6540,
      engagement: 66
    },
    content: {
      description: "Introduction to React framework and components",
      difficulty: "beginner",
      estimatedTime: 60
    }
  },
  {
    name: "Database Design",
    category: "Backend",
    impactScore: 45,
    state: "watchlist",
    metrics: {
      views: 3420,
      completions: 1230,
      engagement: 36
    },
    content: {
      description: "Database design principles and best practices",
      difficulty: "intermediate",
      estimatedTime: 90
    }
  },
  {
    name: "Advanced CSS",
    category: "Frontend",
    impactScore: 92,
    state: "save",
    metrics: {
      views: 15670,
      completions: 12340,
      engagement: 79
    },
    content: {
      description: "Advanced CSS techniques and animations",
      difficulty: "intermediate",
      estimatedTime: 75
    }
  },
  {
    name: "Python for Beginners",
    category: "Programming",
    impactScore: 88,
    state: "ok",
    metrics: {
      views: 18920,
      completions: 14560,
      engagement: 77
    },
    content: {
      description: "Learn Python programming from scratch",
      difficulty: "beginner",
      estimatedTime: 50
    }
  },
  {
    name: "Node.js Backend",
    category: "Backend",
    impactScore: 67,
    state: "ok",
    metrics: {
      views: 7650,
      completions: 4320,
      engagement: 56
    },
    content: {
      description: "Build backend APIs with Node.js and Express",
      difficulty: "intermediate",
      estimatedTime: 80
    }
  },
  {
    name: "Mobile App Development",
    category: "Mobile",
    impactScore: 73,
    state: "watchlist",
    metrics: {
      views: 5430,
      completions: 2980,
      engagement: 55
    },
    content: {
      description: "Cross-platform mobile app development",
      difficulty: "intermediate",
      estimatedTime: 120
    }
  },
  {
    name: "Machine Learning Basics",
    category: "AI/ML",
    impactScore: 81,
    state: "save",
    metrics: {
      views: 11230,
      completions: 7890,
      engagement: 70
    },
    content: {
      description: "Introduction to machine learning concepts",
      difficulty: "advanced",
      estimatedTime: 100
    }
  }
];

const seedUsers = [
  {
    email: "admin@50cube.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    isAdmin: true,
    credits: 5000,
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
    firstName: "Demo",
    lastName: "User",
    isAdmin: false,
    credits: 2500,
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
    await Lane.insertMany(sampleLanes)

    // Create users with hashed passwords
    for (const userData of seedUsers) {
      const user = new User({
        email: userData.email,
        password: userData.password, // Will be hashed by pre-save hook
        firstName: userData.firstName,
        lastName: userData.lastName,
        isAdmin: userData.isAdmin,
        credits: userData.credits,
        stats: userData.stats
      })
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
