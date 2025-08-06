import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { sampleProducts } from '../data/sampleProducts';
import api from '../services/api';

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const Button = ({ children, variant = "default", size = "default", className = "", onClick, disabled, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "bg-red-600 text-white hover:bg-red-700"
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
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ id, type = "text", value, onChange, placeholder, className = "", ...props }) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ htmlFor, children, className = "" }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const Textarea = ({ id, value, onChange, placeholder, className = "", rows = 3, ...props }) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const ProductForm = ({ product, onSubmit, onCancel, mode = "add" }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'Electronics',
    image: product?.image || '',
    rating: product?.rating || '',
    reviews: product?.reviews || '',
    features: product?.features ? product.features.join('\n') : '',
    inStock: product?.inStock !== false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const features = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: formData.rating ? parseFloat(formData.rating) : null,
      reviews: formData.reviews ? parseInt(formData.reviews) : 0,
      features,
      inStock: formData.inStock
    };

    onSubmit(productData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === "add" ? "Add New Product" : "Edit Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <option value="Electronics">Electronics</option>
                <option value="Stationery">Stationery</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Books">Books</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="4.5"
              />
            </div>

            <div>
              <Label htmlFor="reviews">Review Count</Label>
              <Input
                id="reviews"
                name="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={handleInputChange}
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Image URL *</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://images.unsplash.com/..."
              className={errors.image ? "border-red-500" : ""}
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded border"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="features">Features (one per line)</Label>
            <Textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="inStock"
              name="inStock"
              type="checkbox"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={Object.keys(errors).length > 0}
            >
              {mode === "add" ? "Add Product" : "Update Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      // Try to fetch from admin API first, fallback to public catalog
      const response = await api.get('/admin/products');
      setProducts(response.data.products);
    } catch (error) {
      console.log("Falling back to public catalog");
      try {
        const response = await api.get('/merch/catalog');
        setProducts(response.data.products);
      } catch (catalogError) {
        console.log("Using sample products data");
        setProducts(sampleProducts);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await api.post('/admin/products', productData);
      const newProduct = response.data.product;
      
      setProducts(prev => [newProduct, ...prev]);
      setShowForm(false);
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      const response = await api.put(`/admin/products/${editingProduct._id}`, productData);
      const updatedProduct = response.data.product;
      
      setProducts(prev => prev.map(p => 
        p._id === editingProduct._id ? updatedProduct : p
      ));
      setEditingProduct(null);
      setShowForm(false);
      
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`);
        setProducts(prev => prev.filter(p => p._id !== productId));
        
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const getCategories = () => {
    const categories = ['All', ...new Set(products.map(product => product.category))];
    return categories;
  };

  if (showForm) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setShowForm(false)}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h1>
              <p className="text-gray-600">Manage your product catalog</p>
            </div>
          </header>
          
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            mode={editingProduct ? "edit" : "add"}
          />
        </div>
      </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Add, edit, and manage your product catalog</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Product
          </Button>
        </header>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative max-w-md mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {getCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
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
              <Card key={product._id || product.id} className="hover:shadow-lg transition-shadow">
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
                    <Badge variant={product.inStock ? "success" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {(product.rating?.average || product.rating) && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                          {product.rating?.average || product.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({product.rating?.count || product.reviews || 0})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                                         <Button
                       variant="destructive"
                       size="sm"
                       onClick={() => handleDeleteProduct(product._id || product.id)}
                     >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria</p>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-4"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 