const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Apparel", "Drinkware", "Stationery", "Accessories", "Bags", "Electronics"],
    },
    image: {
      type: String,
      default: "/placeholder.svg",
    },
    images: [{
      type: String,
    }],
    inStock: {
      type: Boolean,
      default: true,
    },
    inventory: {
      type: Number,
      default: 100,
      min: 0,
    },
    features: [{
      type: String,
    }],
    specifications: {
      type: Map,
      of: String,
    },
    shipping: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
    },
    tags: [{
      type: String,
    }],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Product", productSchema)
