import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ShoppingCartIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  StarIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import MerchQuote from '../components/MerchQuote';
import ProductDetail from '../components/ProductDetail';
import { sampleProducts } from '../data/sampleProducts';
import api from '../services/api';
import { authService } from '../services/api';

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

const Button = ({ children, variant = "default", size = "default", className = "", onClick, disabled, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default function MerchPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('catalog'); // 'catalog', 'detail', 'redeem'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchProducts();
    checkUserAuth();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const checkUserAuth = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.log('User not authenticated');
      setCurrentUser(null);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'reviews':
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const fetchProducts = async () => {
    try {
      // Try to fetch from API first, fallback to sample data
      const response = await api.get('/merch/catalog');
      setProducts(response.data.products);
    } catch (error) {
      console.log("Using sample products data");
      // Use enhanced sample data with better product information
      const enhancedSampleProducts = [
        {
          id: "1",
          name: "50cube Logo T-Shirt",
          description: "Premium cotton t-shirt with 50cube logo",
          price: 29.99,
          image: "/placeholder.svg",
          category: "Apparel",
          rating: 4.5,
          reviews: 23,
          inStock: true,
          features: ["Premium cotton", "50cube branding", "Comfortable fit"]
        },
        {
          id: "2",
          name: "Learning Champion Mug",
          description: "Ceramic mug for your daily motivation",
          price: 19.99,
          image: "/placeholder.svg",
          category: "Drinkware",
          rating: 4.8,
          reviews: 45,
          inStock: true,
          features: ["350ml capacity", "Microwave safe", "Motivational design"]
        },
        {
          id: "3",
          name: "Premium Learning Hoodie",
          description: "Comfortable hoodie for focused study sessions",
          price: 59.99,
          image: "/placeholder.svg",
          category: "Apparel",
          rating: 4.7,
          reviews: 18,
          inStock: true,
          features: ["Fleece lining", "Kangaroo pocket", "Study comfort"]
        },
        {
          id: "4",
          name: "Knowledge Journal",
          description: "High-quality notebook for taking notes",
          price: 24.99,
          image: "/placeholder.svg",
          category: "Stationery",
          rating: 4.6,
          reviews: 32,
          inStock: true,
          features: ["200 pages", "Premium paper", "Spiral binding"]
        },
        {
          id: "5",
          name: "50cube Sticker Pack",
          description: "Collection of motivational stickers",
          price: 9.99,
          image: "/placeholder.svg",
          category: "Accessories",
          rating: 4.4,
          reviews: 67,
          inStock: true,
          features: ["10 stickers", "High quality vinyl", "Motivational quotes"]
        },
        {
          id: "6",
          name: "Study Companion Backpack",
          description: "Durable backpack for students and learners",
          price: 79.99,
          image: "/placeholder.svg",
          category: "Bags",
          rating: 4.9,
          reviews: 28,
          inStock: true,
          features: ["Laptop compartment", "Water resistant", "Ergonomic design"]
        }
      ];
      setProducts(enhancedSampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = ['All', ...new Set(products.map(product => product.category))];
    return categories;
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setViewMode('detail');
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    setViewMode('catalog');
  };

  const handleRedeem = (product) => {
    setSelectedProduct(product);
    setViewMode('redeem');
  };

  if (viewMode === 'redeem' && selectedProduct) {
    return <MerchQuote product={selectedProduct} onBack={() => setViewMode('detail')} />;
  }

  if (viewMode === 'detail' && selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={handleBackToCatalog}
        onRedeem={() => handleRedeem(selectedProduct)}
      />
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Merchandise Store</h1>
            <p className="text-gray-600">Redeem your credits for exclusive items</p>
          </div>
          <div className="flex items-center gap-2">
            {currentUser?.isAdmin && (
              <Link to="/admin/products">
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </header>

        {/* Quick Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Quick search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setSortBy('name');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {filteredProducts.length === 0 && !loading && (
            <div className="flex items-center gap-4">
              <p className="text-gray-500">No products found matching your criteria</p>
              {currentUser?.isAdmin && (
                <Link to="/admin/products">
                  <Button className="flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Add First Product
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProductClick(product)}>
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <CardDescription className="mb-3 line-clamp-2">{product.description}</CardDescription>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      {product.features && product.features.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {product.features.slice(0, 2).join(' • ')}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRedeem(product);
                      }}
                      className="rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Redeem
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Floating Action Button for Admin */}
        {currentUser?.isAdmin && (
          <Link to="/admin/products">
            <Button 
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-blue-600 hover:bg-blue-700 text-white"
              size="icon"
              title="Add New Product"
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
