const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Apparel', 'Drinkware', 'Stationery', 'Accessories', 'Bags', 'Electronics'],
    required: true 
  },
  image: { type: String, required: true },
  features: [String],
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { category } = req.query;
    
    let query = { inStock: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    // If no products in database, return sample data
    if (products.length === 0) {
      const sampleProducts = [
        {
          _id: '1',
          name: '50Cube T-Shirt',
          description: 'Comfortable cotton t-shirt with 50Cube branding',
          price: 25.00,
          category: 'Apparel',
          image: 'https://via.placeholder.com/300x300?text=50Cube+T-Shirt',
          features: ['100% Cotton', 'Multiple sizes', 'Machine washable'],
          inStock: true
        },
        {
          _id: '2',
          name: '50Cube Water Bottle',
          description: 'Stainless steel water bottle with 50Cube logo',
          price: 35.00,
          category: 'Drinkware',
          image: 'https://via.placeholder.com/300x300?text=50Cube+Water+Bottle',
          features: ['Stainless steel', '500ml capacity', 'BPA free'],
          inStock: true
        },
        {
          _id: '3',
          name: '50Cube Notebook',
          description: 'Premium notebook with 50Cube branding',
          price: 15.00,
          category: 'Stationery',
          image: 'https://via.placeholder.com/300x300?text=50Cube+Notebook',
          features: ['100 pages', 'Hardcover', 'A5 size'],
          inStock: true
        }
      ];

      return res.status(200).json({
        products: sampleProducts,
        total: sampleProducts.length
      });
    }

    res.status(200).json({
      products,
      total: products.length
    });

  } catch (error) {
    console.error('Catalog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 