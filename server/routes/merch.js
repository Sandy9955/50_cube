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
    res.json({ products })
  } catch (error) {
    console.log("⚠️ Database not available, returning empty catalog")
    res.json({ products: [] })
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

    // Find product
    const product = await Product.findById(productId)
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

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Create Stripe payment intent (test mode)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cashAmount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        productId: productId,
        creditsUsed: creditsToUse.toString(),
        userId: user._id.toString(),
      },
    })

    // Create redemption record
    const redemption = new Redemption({
      userId: user._id,
      productId: productId,
      creditsUsed: creditsToUse,
      cashAmount: cashAmount,
      totalAmount: cashAmount,
      stripePaymentId: paymentIntent.id,
      status: "pending", // Will be updated to 'completed' when payment confirms
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
