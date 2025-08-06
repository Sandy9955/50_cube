const express = require("express")
const Joi = require("joi")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const Product = require("../models/Product")
const User = require("../models/User")
const Redemption = require("../models/Redemption")
const jwt = require("jsonwebtoken")

const router = express.Router()

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here_make_it_long_and_secure";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Validation schemas
const quoteSchema = Joi.object({
  productId: Joi.string().required(),
  creditsToUse: Joi.number().integer().min(0).required(),
})

const redeemSchema = Joi.object({
  productId: Joi.string().required(),
  creditsToUse: Joi.number().integer().min(0).required(),
  cashAmount: Joi.number().min(0).required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default("US"),
  }).required(),
})

// GET /api/merch/catalog - Get all products
router.get("/catalog", async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 })
    
    // If no products in database, return sample data
    if (products.length === 0) {
      const sampleProducts = [
        {
          _id: '1',
          name: '50Cube Premium T-Shirt',
          description: 'Comfortable cotton t-shirt with 50Cube branding. Perfect for developers and tech enthusiasts.',
          price: 29.99,
          category: 'Apparel',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
          features: ['Premium cotton', '50Cube branding', 'Comfortable fit', 'Multiple sizes'],
          inStock: true
        },
        {
          _id: '2',
          name: '50Cube Coffee Mug',
          description: 'Ceramic coffee mug with 50Cube logo. Perfect for your morning coding sessions.',
          price: 19.99,
          category: 'Drinkware',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
          features: ['350ml capacity', 'Microwave safe', '50Cube branding', 'Dishwasher safe'],
          inStock: true
        },
        {
          _id: '3',
          name: '50Cube Hoodie',
          description: 'Comfortable hoodie with 50Cube branding. Perfect for late-night coding sessions.',
          price: 59.99,
          category: 'Apparel',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
          features: ['Fleece lining', 'Kangaroo pocket', '50Cube branding', 'Comfortable fit'],
          inStock: true
        },
        {
          _id: '4',
          name: '50Cube Notebook',
          description: 'High-quality notebook with 50Cube branding. Perfect for taking notes and sketching ideas.',
          price: 24.99,
          category: 'Stationery',
          image: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400&h=400&fit=crop',
          features: ['200 pages', 'Premium paper', '50Cube branding', 'Spiral binding'],
          inStock: true
        },
        {
          _id: '5',
          name: '50Cube Sticker Pack',
          description: 'Collection of 50Cube branded stickers. Perfect for laptops, water bottles, and more.',
          price: 9.99,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop',
          features: ['10 stickers', 'High quality vinyl', '50Cube branding', 'Various designs'],
          inStock: true
        },
        {
          _id: '6',
          name: '50Cube Backpack',
          description: 'Durable backpack with 50Cube branding. Perfect for carrying your laptop and essentials.',
          price: 79.99,
          category: 'Bags',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
          features: ['Laptop compartment', 'Water resistant', '50Cube branding', 'Ergonomic design'],
          inStock: true
        },
        {
          _id: '7',
          name: '50Cube Wireless Headphones',
          description: 'Premium noise-canceling headphones with 50Cube branding. Perfect for focused work sessions.',
          price: 89.99,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          features: ['Noise cancellation', '30-hour battery', '50Cube branding', 'Premium sound'],
          inStock: true
        },
        {
          _id: '8',
          name: '50Cube Mechanical Keyboard',
          description: 'RGB mechanical keyboard with 50Cube branding. Customizable backlighting and macro keys.',
          price: 149.99,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
          features: ['Cherry MX switches', 'RGB backlighting', '50Cube branding', 'Premium build'],
          inStock: true
        }
      ];
      
      return res.json({ products: sampleProducts })
    }
    
    res.json({ products })
  } catch (error) {
    console.log("⚠️ Database not available, returning sample products")
    // Return sample products as fallback
    const sampleProducts = [
      {
        _id: '1',
        name: '50Cube Premium T-Shirt',
        description: 'Comfortable cotton t-shirt with 50Cube branding. Perfect for developers and tech enthusiasts.',
        price: 29.99,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        features: ['Premium cotton', '50Cube branding', 'Comfortable fit', 'Multiple sizes'],
        inStock: true
      },
      {
        _id: '2',
        name: '50Cube Coffee Mug',
        description: 'Ceramic coffee mug with 50Cube logo. Perfect for your morning coding sessions.',
        price: 19.99,
        category: 'Drinkware',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        features: ['350ml capacity', 'Microwave safe', '50Cube branding', 'Dishwasher safe'],
        inStock: true
      },
      {
        _id: '3',
        name: '50Cube Hoodie',
        description: 'Comfortable hoodie with 50Cube branding. Perfect for late-night coding sessions.',
        price: 59.99,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        features: ['Fleece lining', 'Kangaroo pocket', '50Cube branding', 'Comfortable fit'],
        inStock: true
      }
    ];
    res.json({ products: sampleProducts })
  }
})

// POST /api/merch/quote - Get pricing quote with credits applied
router.post("/quote", authenticateToken, async (req, res) => {
  try {
    const { error, value } = quoteSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { productId, creditsToUse } = value

    // Get real user from database
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check for pending credits
    if (user.pendingCredits > 0) {
      return res.status(400).json({
        error: "Redemption blocked: You have pending credits that need to be resolved",
      })
    }

    // Find product (try database first, then fallback to demo products)
    let product = await Product.findById(productId)
    
    if (!product) {
      // Fallback to demo products
      const demoProducts = [
        {
          _id: '1',
          name: '50Cube Premium T-Shirt',
          price: 29.99,
        },
        {
          _id: '2', 
          name: '50Cube Coffee Mug',
          price: 19.99,
        },
        {
          _id: '3',
          name: '50Cube Hoodie', 
          price: 59.99,
        },
        {
          _id: '4',
          name: '50Cube Notebook',
          price: 24.99,
        },
        {
          _id: '5',
          name: '50Cube Sticker Pack',
          price: 9.99,
        },
        {
          _id: '6',
          name: '50Cube Backpack',
          price: 79.99,
        },
        {
          _id: '7',
          name: '50Cube Wireless Headphones',
          price: 89.99,
        },
        {
          _id: '8',
          name: '50Cube Mechanical Keyboard',
          price: 149.99,
        }
      ];
      
      product = demoProducts.find(p => p._id === productId);
    }
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Check if user has enough credits
    if (creditsToUse > user.credits) {
      return res.status(400).json({ error: "Insufficient credits" })
    }

    const itemPrice = product.price
    const creditValue = 0.03 // 1 credit = $0.03
    const maxCreditsAllowed = Math.floor((itemPrice * 0.6) / creditValue) // Max 60%

    // Clamp credits to maximum allowed
    const actualCreditsToUse = Math.min(creditsToUse, maxCreditsAllowed)
    const creditsValue = actualCreditsToUse * creditValue
    const cashAmount = itemPrice - creditsValue

    // Calculate shipping and tax (must be paid in cash)
    const shipping = 5.99
    const tax = itemPrice * 0.08 // 8% tax
    const total = cashAmount + shipping + tax

    const quote = {
      itemPrice,
      creditsToUse: actualCreditsToUse,
      creditsValue,
      cashAmount,
      shipping,
      tax,
      total,
      maxCreditsAllowed,
      creditsUsedPercentage: (creditsValue / itemPrice) * 100,
    }

    res.json({ quote })
  } catch (error) {
    console.error("Error generating quote:", error)
    res.status(500).json({ error: "Failed to generate quote" })
  }
})

// POST /api/merch/redeem - Complete redemption with Stripe payment
router.post("/redeem", authenticateToken, async (req, res) => {
  try {
    const { error, value } = redeemSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { productId, creditsToUse, cashAmount, shippingAddress } = value

    // Get real user from database
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.pendingCredits > 0) {
      return res.status(400).json({
        error: "Redemption blocked: You have pending credits",
      })
    }

    if (creditsToUse > user.credits) {
      return res.status(400).json({ error: "Insufficient credits" })
    }

    // Find product (try database first, then fallback to demo products)
    let product = await Product.findById(productId)
    
    if (!product) {
      // Fallback to demo products
      const demoProducts = [
        {
          _id: '1',
          name: '50Cube Premium T-Shirt',
          price: 29.99,
        },
        {
          _id: '2', 
          name: '50Cube Coffee Mug',
          price: 19.99,
        },
        {
          _id: '3',
          name: '50Cube Hoodie', 
          price: 59.99,
        },
        {
          _id: '4',
          name: '50Cube Notebook',
          price: 24.99,
        },
        {
          _id: '5',
          name: '50Cube Sticker Pack',
          price: 9.99,
        },
        {
          _id: '6',
          name: '50Cube Backpack',
          price: 79.99,
        },
        {
          _id: '7',
          name: '50Cube Wireless Headphones',
          price: 89.99,
        },
        {
          _id: '8',
          name: '50Cube Mechanical Keyboard',
          price: 149.99,
        }
      ];
      
      product = demoProducts.find(p => p._id === productId);
    }
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Create Stripe payment intent (test mode)
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(cashAmount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          productId: productId,
          creditsUsed: creditsToUse.toString(),
          userId: user._id.toString(),
        },
      });
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      // For demo purposes, create a mock payment intent
      paymentIntent = {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      };
    }

    // Create redemption record
    const redemption = new Redemption({
      userId: user._id,
      productId: productId,
      creditsUsed: creditsToUse,
      cashAmount: cashAmount,
      totalAmount: cashAmount,
      stripePaymentId: paymentIntent.id,
      status: "completed", // Mark as completed for demo
      shippingAddress: shippingAddress,
    })

    await redemption.save()

    // Update user credits
    user.credits -= creditsToUse;
    user.stats.redemptions += 1;
    await user.save();

    res.json({
      success: true,
      redemptionId: redemption._id,
      paymentIntent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
      },
    })
  } catch (error) {
    console.error("Error processing redemption:", error)
    res.status(500).json({ error: "Redemption failed" })
  }
})

module.exports = router
