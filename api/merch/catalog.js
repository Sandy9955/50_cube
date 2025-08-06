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