import React, { useState } from 'react';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import MerchQuote from './MerchQuote';

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
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 bg-white text-gray-700"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const ProductDetail = ({ product, onBack, onRedeem }) => {
  const [showRedeem, setShowRedeem] = useState(false);

  if (showRedeem) {
    return <MerchQuote product={product} onBack={() => setShowRedeem(false)} />;
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">Product Details</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={`${product.name} view ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {(product.rating?.average || product.rating) && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon 
                        key={star} 
                        className={`h-4 w-4 ${star <= Math.floor(product.rating?.average || product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.rating?.count || product.reviews || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <div className="text-3xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Product Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  {product.features && product.features.length > 0 ? (
                    product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        {feature}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        High-quality materials and craftsmanship
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Perfect for students and professionals
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Durable and long-lasting design
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Includes warranty and support
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Shipping & Returns */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <TruckIcon className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-600">Standard delivery 3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">30-Day Returns</p>
                      <p className="text-sm text-gray-600">Easy returns with full refund</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => setShowRedeem(true)}
                className="w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                size="lg"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Redeem with Credits
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                size="lg"
              >
                Add to Wishlist
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-500 space-y-1">
              <p>SKU: {product.id}</p>
              <p>Category: {product.category}</p>
              <p>Availability: In Stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 