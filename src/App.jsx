<<<<<<< Updated upstream
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <></>
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" />
                <Route path="/contact" />
                <Route path="/login" />
                <Route path="/signup" />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
>>>>>>> Stashed changes
  );
}

export default App;
