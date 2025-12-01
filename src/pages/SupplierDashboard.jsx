import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const SupplierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user.role === 'SUPPLIER') {
      fetchProducts();
    }
  }, [isAuthenticated, user]);

  const fetchProducts = async () => {
    try {
      const allProducts = await apiService.products.getAll();
      // Filter products by supplier (assuming supplier ID is available)
      // For now, showing all products - in real app, filter by supplier ID
      setProducts(allProducts);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await apiService.products.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (!isAuthenticated || user.role !== 'SUPPLIER') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Access denied. Supplier login required.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-blue-600">
            Supplier Dashboard
          </h1>
          <p className="text-center text-gray-600">
            Welcome back, {user.fullName}!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/add-product"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <div className="text-4xl mb-4">➕</div>
            <h3 className="text-xl font-semibold mb-2">Add Product</h3>
            <p className="text-gray-600">Add new products to inventory</p>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Total Products</h3>
            <p className="text-2xl font-bold text-blue-600">{products.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">Coming Soon</p>
          </div>
        </div>

        {/* Products Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Products</h2>
            <Link
              to="/add-product"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add New Product
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No products found</p>
              <Link
                to="/add-product"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Product Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-2">
                        <div>
                          <div className="font-medium">{product.productName}</div>
                          <div className="text-sm text-gray-500">{product.manufacturer}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2">{product.category}</td>
                      <td className="px-4 py-2">₹{product.price}</td>
                      <td className="px-4 py-2">{product.stockQuantity}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          product.stockQuantity > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <Link
                            to={`/edit-product/${product.id}`}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;