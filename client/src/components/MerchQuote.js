import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, CreditCardIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
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

const Input = ({ id, type = "text", min, max, value, onChange, className = "", ...props }) => (
  <input
    id={id}
    type={type}
    min={min}
    max={max}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ htmlFor, children, className = "" }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const Alert = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-50 text-blue-800 border-blue-200",
    destructive: "bg-red-50 text-red-800 border-red-200"
  };
  
  return (
    <div className={`p-4 rounded-md border ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = "" }) => (
  <p className={`text-sm ${className}`}>
    {children}
  </p>
);

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

export default function MerchQuote({ product, onBack }) {
  const [userCredits] = useState(2500); // Mock user credits
  const [creditsToUse, setCreditsToUse] = useState(0);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (creditsToUse > 0) {
      getQuote();
    }
  }, [creditsToUse]);

  const getQuote = async () => {
    setLoading(true);
    setError("");

    try {
      // Call real API
      const response = await api.post('/merch/quote', {
        productId: product.id,
        creditsToUse: creditsToUse,
      });
      setQuote(response.data.quote);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to get quote");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!quote) return;

    setRedeeming(true);
    setError("");

    try {
      // Call real API
      const response = await api.post('/merch/redeem', {
        productId: product.id,
        creditsToUse: creditsToUse,
        cashAmount: quote.cashAmount + quote.shipping + quote.tax,
        shippingAddress: {
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
          country: "US"
        }
      });
      setRedeemed(true);
    } catch (error) {
      setError(error.response?.data?.error || "Redemption failed");
    } finally {
      setRedeeming(false);
    }
  };

  if (redeemed) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CreditCardIcon className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Redemption Successful!</CardTitle>
              <CardDescription>Your order has been processed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                You've successfully redeemed {creditsToUse} credits for {product.name}. Your item will be shipped to
                your registered address.
              </p>
              <Button onClick={onBack} className="rounded-md">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Redeem Credits</h1>
            <p className="text-gray-600">Apply your credits to purchase {product.name}</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Info */}
          <Card>
            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                {product.name}
                <Badge variant="secondary">{product.category}</Badge>
              </CardTitle>
              <CardDescription>{product.description}</CardDescription>
              <div className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
            </CardHeader>
          </Card>

          {/* Quote Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-5 w-5" />
                  Your Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">{userCredits.toLocaleString()} credits</div>
                <p className="text-sm text-gray-600">1 credit = $0.03 • Max 60% of item price</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Apply Credits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="credits">Credits to use</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="0"
                    max={userCredits}
                    value={creditsToUse}
                    onChange={(e) => setCreditsToUse(Number.parseInt(e.target.value) || 0)}
                    className="rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Quick redeem options */}
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCreditsToUse(Math.min(500, userCredits))}
                      className="text-xs"
                    >
                      Use 500
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCreditsToUse(Math.min(1000, userCredits))}
                      className="text-xs"
                    >
                      Use 1000
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const maxAllowed = Math.floor(product.price * 0.6 / 0.03);
                        setCreditsToUse(Math.min(maxAllowed, userCredits));
                      }}
                      className="text-xs"
                    >
                      Max (60%)
                    </Button>
                  </div>
                </div>

                {loading && (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Calculating quote...</span>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {quote && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>Item Price:</span>
                      <span>${quote.itemPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Credits Applied ({quote.creditsToUse}):</span>
                      <span>-${quote.creditsValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash Amount:</span>
                      <span>${quote.cashAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${quote.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${quote.tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total to Pay:</span>
                      <span>${quote.total.toFixed(2)}</span>
                    </div>

                    {/* Savings Summary */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex justify-between text-green-700">
                        <span className="font-medium">You Save:</span>
                        <span className="font-bold">${quote.creditsValue.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {quote.creditsUsedPercentage.toFixed(1)}% discount applied
                      </div>
                    </div>

                    {quote.creditsUsedPercentage >= 60 && (
                      <Alert>
                        <AlertDescription>
                          Credits capped at 60% of item price ({quote.maxCreditsAllowed} credits max)
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {quote && (
                  <div className="space-y-3">
                    <Button
                      onClick={handleRedeem}
                      disabled={redeeming || loading}
                      className="w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-green-600 hover:bg-green-700"
                    >
                      {redeeming ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing Redemption...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CreditCardIcon className="h-5 w-5" />
                          Redeem & Pay ${quote.total.toFixed(2)}
                        </div>
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        You'll be redirected to secure payment after redemption
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
