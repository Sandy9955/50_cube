const express = require("express")
const Joi = require("joi")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const Product = require("../models/Product")
const User = require("../models/User")
const Redemption = require("../models/Redemption")

const router = express.Router()

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Please log in to access merchandise")
    return res.redirect("/login")
  }
  next()
}

// Validation schemas
const quoteSchema = Joi.object({
  productId: Joi.string().required(),
  creditsToUse: Joi.number().integer().min(0).required(),
})

// GET /merch - Merchandise catalog
router.get("/", requireAuth, async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 })
    res.render("merch/catalog", {
      title: "Merchandise Store - 50cube",
      products,
      user: req.session.user,
    })
  } catch (error) {
    console.error("Error fetching catalog:", error)
    req.flash("error", "Failed to load merchandise catalog")
    res.redirect("/")
  }
})

// GET /merch/quote/:id - Quote page for specific product
router.get("/quote/:id", requireAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      req.flash("error", "Product not found")
      return res.redirect("/merch")
    }

    res.render("merch/quote", {
      title: `Redeem ${product.name} - 50cube`,
      product,
      user: req.session.user,
    })
  } catch (error) {
    console.error("Error loading quote page:", error)
    req.flash("error", "Failed to load product")
    res.redirect("/merch")
  }
})

// POST /merch/quote - Get pricing quote with credits applied
router.post("/quote", requireAuth, async (req, res) => {
  try {
    const { error, value } = quoteSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { productId, creditsToUse } = value
    const user = await User.findById(req.session.user.id)

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

// POST /merch/redeem - Complete redemption
router.post("/redeem", requireAuth, async (req, res) => {
  try {
    const { productId, creditsToUse, cashAmount } = req.body
    const user = await User.findById(req.session.user.id)

    if (user.pendingCredits > 0) {
      req.flash("error", "Redemption blocked: You have pending credits")
      return res.redirect("/merch")
    }

    if (creditsToUse > user.credits) {
      req.flash("error", "Insufficient credits")
      return res.redirect("/merch")
    }

    const product = await Product.findById(productId)
    if (!product) {
      req.flash("error", "Product not found")
      return res.redirect("/merch")
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
      status: "completed", // In production, this would be 'pending' until payment confirms
      shippingAddress: {
        street: "123 Demo Street",
        city: "Demo City",
        state: "CA",
        zipCode: "12345",
        country: "US",
      },
    })

    await redemption.save()

    // Update user credits
    user.credits -= creditsToUse
    user.stats.redemptions += 1
    await user.save()

    // Update session
    req.session.user.credits = user.credits

    req.flash("success", `Successfully redeemed ${product.name}!`)
    res.render("merch/success", {
      title: "Redemption Successful - 50cube",
      product,
      redemption,
      creditsUsed: creditsToUse,
    })
  } catch (error) {
    console.error("Error processing redemption:", error)
    req.flash("error", "Redemption failed. Please try again.")
    res.redirect("/merch")
  }
})

module.exports = router
