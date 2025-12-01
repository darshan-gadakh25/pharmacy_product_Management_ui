import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import "./App.css";
import { AuthProvider } from './contexts/AuthContext';
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CustomerDashboard from "./pages/CustomerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About/>} />
            <Route path="/contact" element={<ContactUs/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Register/>} />
            <Route path="/products" element={<Products/>} />
            <Route path="/products/:id" element={<ProductDetails/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/customer-dashboard" element={<CustomerDashboard/>} />
            <Route path="/supplier-dashboard" element={<SupplierDashboard/>} />
            <Route path="/admin-dashboard" element={<AdminDashboard/>} />
            <Route path="/add-product" element={<AddProduct/>} />
            <Route path="/edit-product/:id" element={<EditProduct/>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
