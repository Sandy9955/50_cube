const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = "mongodb+srv://sandip99721:<db_password>@cluster0.vhsl78l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const sampleProducts = [
  {
    name: "50Cube Premium T-Shirt",
    description: "Comfortable cotton t-shirt with 50Cube branding. Perfect for developers and tech enthusiasts.",
    price: 29.99,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"],
    features: [
      "Premium cotton",
      "50Cube branding",
      "Comfortable fit",
      "Multiple sizes",
      "Machine washable"
    ],
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Care": "Machine wash cold",
      "Branding": "50Cube logo"
    },
    shipping: {
      weight: 0.2,
      dimensions: {
        length: 30,
        width: 25,
        height: 2
      }
    },
    tags: ["t-shirt", "apparel", "50cube", "cotton", "tech"],
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
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"],
    features: [
      "350ml capacity",
      "Microwave safe",
      "50Cube branding",
      "Dishwasher safe",
      "Premium ceramic"
    ],
    specifications: {
      "Capacity": "350ml",
      "Material": "Ceramic",
      "Height": "12cm",
      "Diameter": "8cm",
      "Branding": "50Cube logo"
    },
    shipping: {
      weight: 0.3,
      dimensions: {
        length: 12,
        width: 8,
        height: 8
      }
    },
    tags: ["coffee", "mug", "drinkware", "50cube", "ceramic"],
    inStock: true,
    inventory: 150
  },
  {
    name: "50Cube Hoodie",
    description: "Comfortable hoodie with 50Cube branding. Perfect for late-night coding sessions.",
    price: 59.99,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop"],
    features: [
      "Fleece lining",
      "Kangaroo pocket",
      "50Cube branding",
      "Comfortable fit",
      "Machine washable"
    ],
    specifications: {
      "Material": "Cotton/Polyester blend",
      "Fit": "Regular",
      "Care": "Machine wash cold",
      "Branding": "50Cube logo"
    },
    shipping: {
      weight: 0.5,
      dimensions: {
        length: 35,
        width: 30,
        height: 3
      }
    },
    tags: ["hoodie", "apparel", "50cube", "fleece", "comfortable"],
    inStock: true,
    inventory: 75
  },
  {
    name: "50Cube Notebook",
    description: "High-quality notebook with 50Cube branding. Perfect for taking notes and sketching ideas.",
    price: 24.99,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400&h=400&fit=crop"],
    features: [
      "200 pages",
      "Premium paper",
      "50Cube branding",
      "Spiral binding",
      "A5 size"
    ],
    specifications: {
      "Pages": "200",
      "Size": "A5",
      "Binding": "Spiral",
      "Paper": "80gsm",
      "Branding": "50Cube logo"
    },
    shipping: {
      weight: 0.4,
      dimensions: {
        length: 21,
        width: 15,
        height: 2
      }
    },
    tags: ["notebook", "stationery", "50cube", "paper", "notes"],
    inStock: true,
    inventory: 200
  },
  {
    name: "50Cube Sticker Pack",
    description: "Collection of 50Cube branded stickers. Perfect for laptops, water bottles, and more.",
    price: 9.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop"],
    features: [
      "10 stickers",
      "High quality vinyl",
      "50Cube branding",
      "Various designs",
      "Weather resistant"
    ],
    specifications: {
      "Quantity": "10 stickers",
      "Material": "Vinyl",
      "Size": "Various",
      "Branding": "50Cube designs",
      "Durability": "Weather resistant"
    },
    shipping: {
      weight: 0.1,
      dimensions: {
        length: 15,
        width: 10,
        height: 1
      }
    },
    tags: ["stickers", "accessories", "50cube", "vinyl", "decals"],
    inStock: true,
    inventory: 300
  },
  {
    name: "50Cube Backpack",
    description: "Durable backpack with 50Cube branding. Perfect for carrying your laptop and essentials.",
    price: 79.99,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"],
    features: [
      "Laptop compartment",
      "Water resistant",
      "50Cube branding",
      "Ergonomic design",
      "Multiple pockets"
    ],
    specifications: {
      "Material": "Nylon",
      "Capacity": "25L",
      "Laptop": "Up to 15\"",
      "Branding": "50Cube logo",
      "Water Resistance": "Water repellent"
    },
    shipping: {
      weight: 0.8,
      dimensions: {
        length: 45,
        width: 35,
        height: 15
      }
    },
    tags: ["backpack", "bags", "50cube", "laptop", "travel"],
    inStock: true,
    inventory: 50
  },
  {
    name: "50Cube Wireless Headphones",
    description: "Premium noise-canceling headphones with 50Cube branding. Perfect for focused work sessions.",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
    features: [
      "Noise cancellation",
      "30-hour battery",
      "50Cube branding",
      "Premium sound",
      "Bluetooth 5.0"
    ],
    specifications: {
      "Battery": "30 hours",
      "Connectivity": "Bluetooth 5.0",
      "Noise Cancellation": "Active",
      "Branding": "50Cube logo",
      "Charging": "USB-C"
    },
    shipping: {
      weight: 0.3,
      dimensions: {
        length: 20,
        width: 18,
        height: 8
      }
    },
    tags: ["headphones", "electronics", "50cube", "wireless", "audio"],
    inStock: true,
    inventory: 40
  },
  {
    name: "50Cube Mechanical Keyboard",
    description: "RGB mechanical keyboard with 50Cube branding. Customizable backlighting and macro keys.",
    price: 149.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop"],
    features: [
      "Cherry MX switches",
      "RGB backlighting",
      "50Cube branding",
      "Premium build",
      "Macro keys"
    ],
    specifications: {
      "Switches": "Cherry MX",
      "Backlighting": "RGB",
      "Layout": "Full size",
      "Branding": "50Cube logo",
      "Connectivity": "USB-C"
    },
    shipping: {
      weight: 1.2,
      dimensions: {
        length: 45,
        width: 15,
        height: 3
      }
    },
    tags: ["keyboard", "electronics", "50cube", "mechanical", "rgb"],
    inStock: true,
    inventory: 30
  },
  {
    name: "50Cube Laptop Stand",
    description: "Adjustable aluminum laptop stand with 50Cube branding. Ergonomic design for better posture.",
    price: 39.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop"],
    features: [
      "Adjustable height",
      "Cooling vents",
      "50Cube branding",
      "Aluminum build",
      "Ergonomic design"
    ],
    specifications: {
      "Material": "Aluminum",
      "Height": "Adjustable",
      "Weight": "800g",
      "Branding": "50Cube logo",
      "Laptop Size": "Up to 17\""
    },
    shipping: {
      weight: 0.8,
      dimensions: {
        length: 35,
        width: 25,
        height: 5
      }
    },
    tags: ["laptop stand", "electronics", "50cube", "ergonomic", "aluminum"],
    inStock: true,
    inventory: 80
  },
  {
    name: "50Cube Smart Watch",
    description: "Fitness tracking smartwatch with 50Cube branding. Heart rate monitor, GPS, and 7-day battery life.",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"],
    features: [
      "Heart rate monitor",
      "GPS tracking",
      "50Cube branding",
      "Water resistant",
      "7-day battery"
    ],
    specifications: {
      "Battery": "7 days",
      "Water Resistance": "5ATM",
      "GPS": "Built-in",
      "Branding": "50Cube logo",
      "Display": "AMOLED"
    },
    shipping: {
      weight: 0.2,
      dimensions: {
        length: 10,
        width: 8,
        height: 2
      }
    },
    tags: ["smartwatch", "electronics", "50cube", "fitness", "gps"],
    inStock: true,
    inventory: 25
  },
  {
    name: "50Cube Wireless Mouse",
    description: "Ergonomic wireless mouse with 50Cube branding. Precision tracking and customizable buttons.",
    price: 59.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop"],
    features: [
      "Ergonomic design",
      "Precision tracking",
      "50Cube branding",
      "Long battery",
      "Customizable buttons"
    ],
    specifications: {
      "DPI": "Up to 12000",
      "Battery": "6 months",
      "Connectivity": "2.4GHz",
      "Branding": "50Cube logo",
      "Buttons": "6 programmable"
    },
    shipping: {
      weight: 0.1,
      dimensions: {
        length: 12,
        width: 8,
        height: 4
      }
    },
    tags: ["mouse", "electronics", "50cube", "wireless", "ergonomic"],
    inStock: true,
    inventory: 60
  },
  {
    name: "50Cube Desk Lamp",
    description: "LED desk lamp with 50Cube branding. Adjustable brightness and color temperature for optimal lighting.",
    price: 44.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop"],
    features: [
      "Adjustable brightness",
      "Color temperature",
      "50Cube branding",
      "Energy efficient",
      "Touch controls"
    ],
    specifications: {
      "Brightness": "Adjustable",
      "Color Temperature": "2700K-6500K",
      "Power": "LED",
      "Branding": "50Cube logo",
      "Controls": "Touch"
    },
    shipping: {
      weight: 0.6,
      dimensions: {
        length: 30,
        width: 20,
        height: 8
      }
    },
    tags: ["desk lamp", "electronics", "50cube", "led", "lighting"],
    inStock: true,
    inventory: 70
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
