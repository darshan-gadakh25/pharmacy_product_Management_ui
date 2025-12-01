import React, { useState } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const ApiTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState({});

  const testEndpoints = async () => {
    setTesting(true);
    const testResults = {};

    // Test products endpoint
    try {
      console.log('Testing products endpoint...');
      const products = await apiService.products.getAll();
      testResults.products = { success: true, data: products };
      toast.success('Products API working!');
    } catch (error) {
      console.error('Products API failed:', error);
      testResults.products = { success: false, error: error.message };
    }

    // Test basic connectivity
    try {
      console.log('Testing basic connectivity...');
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      testResults.connectivity = { 
        success: response.ok, 
        status: response.status,
        statusText: response.statusText 
      };
    } catch (error) {
      console.error('Registration API failed:', error);
      testResults.registration = { success: false, error: error.message };
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      
      <button
        onClick={testEndpoints}
        disabled={testing}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test API Connection'}
      </button>
    
      {Object.keys(results).length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Test Results:</h4>
          {Object.entries(results).map(([key, result]) => (
            <div key={key} className="p-2 border rounded">
              <strong>{key}:</strong>{' '}
              <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                {result.success ? '✅ Success' : '❌ Failed'}
              </span>
              {result.error && (
                <div className="text-sm text-red-600 mt-1">
                  Error: {result.error}
                </div>
              )}
              {result.status && (
                <div className="text-sm text-gray-600 mt-1">
                  Status: {result.status} {result.statusText}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTest;