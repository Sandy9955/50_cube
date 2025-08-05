const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = "mongodb+srv://sandip99721:<db_password>@cluster0.vhsl78l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const sampleProducts = [
  {
    name: "Learning Planner",
    description: "12-month academic planner with goal-setting pages, habit trackers, and weekly study schedules.",
    price: 19.99,
    category: "Stationery",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: [
      "12-month planning",
      "Goal-setting pages",
      "Habit trackers",
      "Weekly study schedules",
      "Premium paper quality"
    ],
    specifications: {
      "Pages": "240",
      "Size": "A5",
      "Binding": "Spiral",
      "Paper": "80gsm"
    },
    shipping: {
      weight: 0.5,
      dimensions: {
        length: 21,
        width: 15,
        height: 2
      }
    },
    tags: ["planner", "academic", "study", "organization"],
    inStock: true,
    inventory: 50
  },
  {
    name: "Premium Coffee Mug",
    description: "High-quality ceramic coffee mug with the 50cube logo. Perfect for your morning brew.",
    price: 12.99,
    category: "Drinkware",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: [
      "350ml capacity",
      "Microwave safe",
      "Dishwasher safe",
      "Premium ceramic",
      "50cube branding"
    ],
    specifications: {
      "Capacity": "350ml",
      "Material": "Ceramic",
      "Height": "12cm",
      "Diameter": "8cm"
    },
    shipping: {
      weight: 0.3,
      dimensions: {
        length: 12,
        width: 8,
        height: 8
      }
    },
    tags: ["coffee", "mug", "drinkware", "ceramic"],
    inStock: true,
    inventory: 100
  },
  {
    name: "Tech T-Shirt",
    description: "Comfortable cotton t-shirt with a modern tech design. Available in multiple sizes.",
    price: 24.99,
    category: "Apparel",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: [
      "100% cotton",
      "Multiple sizes",
      "Modern design",
      "Comfortable fit",
      "Machine washable"
    ],
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Care": "Machine wash cold"
    },
    shipping: {
      weight: 0.2,
      dimensions: {
        length: 30,
        width: 25,
        height: 2
      }
    },
    tags: ["t-shirt", "apparel", "cotton", "tech"],
    inStock: true,
    inventory: 75
  },
  {
    name: "Wireless Earbuds",
    description: "High-quality wireless earbuds with noise cancellation and long battery life.",
    price: 89.99,
    category: "Electronics",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: [
      "Active noise cancellation",
      "20-hour battery life",
      "Bluetooth 5.0",
      "Water resistant",
      "Touch controls"
    ],
    specifications: {
      "Battery": "20 hours",
      "Connectivity": "Bluetooth 5.0",
      "Water Resistance": "IPX4",
      "Charging": "USB-C"
    },
    shipping: {
      weight: 0.1,
      dimensions: {
        length: 8,
        width: 6,
        height: 3
      }
    },
    tags: ["earbuds", "wireless", "audio", "bluetooth"],
    inStock: true,
    inventory: 30
  },
  {
    name: "Laptop Sleeve",
    description: "Protective laptop sleeve with padding and water-resistant exterior.",
    price: 34.99,
    category: "Bags",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: [
      "Water-resistant exterior",
      "Padded interior",
      "Multiple laptop sizes",
      "Lightweight design",
      "Zipper closure"
    ],
    specifications: {
      "Material": "Neoprene",
      "Sizes": "13\", 15\", 17\"",
      "Weight": "200g",
      "Water Resistance": "Splash proof"
    },
    shipping: {
      weight: 0.4,
      dimensions: {
        length: 40,
        width: 30,
        height: 5
      }
    },
    tags: ["laptop", "sleeve", "protection", "neoprene"],
    inStock: true,
    inventory: 40
  },
  {
    name: "Desk Organizer",
    description: "Multi-compartment desk organizer to keep your workspace tidy and organized.",
    price: 29.99,
    category: "Accessories",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: [
      "Multiple compartments",
      "Stable base",
      "Easy assembly",
      "Modern design",
      "Space efficient"
    ],
    specifications: {
      "Material": "Plastic",
      "Dimensions": "25x15x10cm",
      "Compartments": "6",
      "Assembly": "No tools required"
    },
    shipping: {
      weight: 0.8,
      dimensions: {
        length: 25,
        width: 15,
        height: 10
      }
    },
    tags: ["desk", "organizer", "storage", "office"],
    inStock: true,
    inventory: 60
  }
];

const sampleUsers = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "demo@50cube.com",
    password: "password123",
    credits: 2500,
    isAdmin: false,
    stats: {
      bursts: 45,
      wins: 23,
      purchases: 3,
      redemptions: 2,
      referrals: 1
    }
  },
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@50cube.com",
    password: "admin123",
    credits: 5000,
    isAdmin: true,
    stats: {
      bursts: 120,
      wins: 67,
      purchases: 8,
      redemptions: 5,
      referrals: 3
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // Insert sample data
    const products = await Product.insertMany(sampleProducts);
    const users = await User.insertMany(hashedUsers);

    console.log(`✅ Seeded ${products.length} products`);
    console.log(`✅ Seeded ${users.length} users`);

    console.log('\n📋 Sample Data Summary:');
    console.log('Products:', products.map(p => `${p.name} - $${p.price}`));
    console.log('Users:', users.map(u => `${u.firstName} ${u.lastName} (${u.email}) - ${u.credits} credits`));

    console.log('\n🎯 Demo Credentials:');
    console.log('Regular User: demo@50cube.com / password123');
    console.log('Admin User: admin@50cube.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
