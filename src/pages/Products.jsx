import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiService.products.getAll();
      setProducts(data);
      toast.success('Products loaded successfully!');
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Mock data when backend is not available
      const mockProducts = [
        {
          id: 1,
          productName: "Paracetamol 500mg",
          description: "Pain relief and fever reducer",
          category: "Pain Relief",
          price: 25.50,
          stockQuantity: 100,
          manufacturer: "PharmaCorp",
          prescriptionRequired: false
        },
        {
          id: 2,
          productName: "Amoxicillin 250mg",
          description: "Antibiotic for bacterial infections",
          category: "Antibiotics",
          price: 85.00,
          stockQuantity: 50,
          manufacturer: "MediLab",
          prescriptionRequired: true
        }
      ];
      setProducts(mockProducts);
      toast.error('Backend not available. Showing sample data.');
    } finally {
      setLoading(false);
    }
  };
     

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const data = await apiService.products.search(searchQuery);
      setProducts(data);
    } catch (error) {
      console.error('Search error:', error);
      // Filter current products for search
      const filtered = products.filter(product => 
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filtered);
      toast.error('Search failed. Filtering current data.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add products to cart');
      return;
    }

    if (user.role !== 'CUSTOMER') {
      toast.error('Only customers can add products to cart');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
            Pharmacy Products
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Cart Link for Customers */}
          {isAuthenticated && user.role === 'CUSTOMER' && (
            <div className="text-center mb-6">
              <Link
                to="/cart"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition inline-flex items-center"
              >
                🛒 Cart ({cart.length})
              </Link>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.productName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{product.price}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      product.stockQuantity > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
                    <p><strong>Stock:</strong> {product.stockQuantity}</p>
                    {product.prescriptionRequired && (
                      <p className="text-red-600 font-medium">
                        ⚠️ Prescription Required
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-center"
                  >
                    View Details
                  </Link>
                  {isAuthenticated && user.role === 'CUSTOMER' && product.stockQuantity > 0 && (
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;