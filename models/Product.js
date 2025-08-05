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
      default: "/images/placeholder.jpg",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    inventory: {
      type: Number,
      default: 100,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Product", productSchema)
