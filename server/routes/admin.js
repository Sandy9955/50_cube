const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const User = require("../models/User");
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here_make_it_long_and_secure";

// Middleware to verify JWT token and admin status
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    
    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    req.user = user;
    next();
  });
};

// GET /api/admin/products - Get all products (admin view)
router.get("/products", authenticateAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /api/admin/products - Create new product
router.post("/products", authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      rating,
      reviews,
      features,
      inStock
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      rating: rating ? parseFloat(rating) : null,
      reviews: reviews ? parseInt(reviews) : 0,
      features: features || [],
      inStock: inStock !== false,
      createdBy: req.user.userId
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/admin/products/:id - Update product
router.put("/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      rating,
      reviews,
      features,
      inStock
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        rating: rating ? parseFloat(rating) : null,
        reviews: reviews ? parseInt(reviews) : 0,
        features: features || [],
        inStock: inStock !== false
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete("/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// GET /api/admin/metrics - Get platform metrics
router.get("/metrics", authenticateAdmin, async (req, res) => {
  try {
    const { since } = req.query;
    
    // Build date filter if since parameter is provided
    const dateFilter = since ? { 
      createdAt: { $gte: new Date(since) } 
    } : {};

    // Get all users with optional date filter
    const users = await User.find(dateFilter);
    
    // Get redemptions with optional date filter
    const Redemption = require("../models/Redemption");
    const redemptions = await Redemption.find(dateFilter);

    // Calculate metrics from user stats
    const metrics = users.reduce(
      (acc, user) => {
        acc.bursts += user.stats?.bursts || 0;
        acc.wins += user.stats?.wins || 0;
        acc.purchases += user.stats?.purchases || 0;
        acc.referrals += user.stats?.referrals || 0;
        return acc;
      },
      { bursts: 0, wins: 0, purchases: 0, referrals: 0 }
    );

    // Add redemptions count
    metrics.redemptions = redemptions.length;

    // Generate chart data for the last 30 days
    const chartData = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      chartData.push({
        date: date.toISOString().split("T")[0],
        bursts: Math.floor(Math.random() * 200) + 400,
        wins: Math.floor(Math.random() * 150) + 250,
        purchases: Math.floor(Math.random() * 50) + 70,
        redemptions: Math.floor(Math.random() * 30) + 40,
        referrals: Math.floor(Math.random() * 20) + 25,
      });
    }

    res.json({
      ...metrics,
      chartData
    });

  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

// GET /api/admin/lanes - Get content lanes
router.get("/lanes", authenticateAdmin, async (req, res) => {
  try {
    const { state } = req.query;
    
    // Build filter if state parameter is provided
    const filter = state && state !== "all" ? { state } : {};
    
    // Get lanes with optional state filter
    const Lane = require("../models/Lane");
    const lanes = await Lane.find(filter).sort({ impactScore: -1 });

    res.json({ lanes });

  } catch (error) {
    console.error("Error fetching lanes:", error);
    res.status(500).json({ error: "Failed to fetch lanes" });
  }
});

// PUT /api/admin/lanes/:id/state - Update lane state
router.put("/lanes/:id/state", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const validStates = ["ok", "watchlist", "save", "archive"];
    if (!validStates.includes(state)) {
      return res.status(400).json({ error: "Invalid state" });
    }

    const Lane = require("../models/Lane");
    const lane = await Lane.findByIdAndUpdate(
      id, 
      { state, updatedAt: new Date() }, 
      { new: true }
    );

    if (!lane) {
      return res.status(404).json({ error: "Lane not found" });
    }

    res.json({
      message: `Lane "${lane.name}" state updated to ${state}`,
      lane
    });

  } catch (error) {
    console.error("Error updating lane state:", error);
    res.status(500).json({ error: "Failed to update lane state" });
  }
});

// GET /api/admin/dashboard - Get dashboard stats
router.get("/dashboard", authenticateAdmin, async (req, res) => {
  try {
    const [
      totalProducts,
      totalUsers,
      activeUsers,
      totalRedemptions
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      // Note: You would need a Redemption model for this
      Promise.resolve(156) // Placeholder
    ]);

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name category price createdAt');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt');

    res.json({
      stats: {
        totalProducts,
        totalUsers,
        activeUsers,
        totalRedemptions
      },
      recentProducts,
      recentUsers
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// GET /api/admin/users - Get all users (admin view)
router.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
