import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from './Context/CartContext';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfileCreation from "./pages/ProfileCreation";
import ProfileDisplay from "./pages/ProfileDisplay";
import ProfileView from "./pages/ProfileView";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NFCConfiguration from "./pages/NFCConfiguration";
import ProductEdit from "./pages/ProductEdit";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router basename="/vishva/tapntag">
      <AuthProvider>
      <CartProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <div style={{ paddingTop: "62.4px" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile-display" element={<ProfileDisplay />} />
                <Route path="/profile/:profileId" element={<ProfileView />} />
                <Route path="/nfc-configuration" element={<NFCConfiguration />} />
                <Route path="/profile-creation" element={<ProfileCreation />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route
                  path="/product-edit/:id"
                  element={
                    <PrivateRoute>
                      <ProductEdit />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-product"
                  element={
                    <PrivateRoute>
                      <AddProduct />
                    </PrivateRoute>
                  }
                />
                <Route path="/products" element={<ProductList />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;