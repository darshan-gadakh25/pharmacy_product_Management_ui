import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await apiService.products.getById(id);
      setProduct(data);
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add products to cart');
      navigate('/login');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      toast.error('Only customers can add products to cart');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success(`${quantity} item(s) added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            ← Back
          </button>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image Placeholder */}
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                <div className="text-6xl">💊</div>
              </div>

              {/* Product Details */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.productName}
                </h1>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{product.price}
                  </span>
                  <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                    product.stockQuantity > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700">Description:</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Category:</h3>
                      <p className="text-gray-600">{product.category}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Manufacturer:</h3>
                      <p className="text-gray-600">{product.manufacturer}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Batch Number:</h3>
                      <p className="text-gray-600">{product.batchNumber}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Expiry Date:</h3>
                      <p className="text-gray-600">
                        {new Date(product.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {product.dosage && (
                    <div>
                      <h3 className="font-semibold text-gray-700">Dosage:</h3>
                      <p className="text-gray-600">{product.dosage}</p>
                    </div>
                  )}

                  {product.sideEffects && (
                    <div>
                      <h3 className="font-semibold text-gray-700">Side Effects:</h3>
                      <p className="text-gray-600">{product.sideEffects}</p>
                    </div>
                  )}

                  {product.prescriptionRequired && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 font-medium">
                        ⚠️ Prescription Required
                      </p>
                      <p className="text-yellow-700 text-sm">
                        This medicine requires a valid prescription from a licensed doctor.
                      </p>
                    </div>
                  )}
                </div>

                {/* Add to Cart Section */}
                {isAuthenticated && user.role === 'CUSTOMER' && product.stockQuantity > 0 && (
                  <div className="border-t pt-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="font-semibold text-gray-700">Quantity:</label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={addToCart}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Add to Cart - ₹{(product.price * quantity).toFixed(2)}
                    </button>
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="border-t pt-6">
                    <p className="text-gray-600 mb-4">Please sign in to purchase this product</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Sign In to Purchase
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;