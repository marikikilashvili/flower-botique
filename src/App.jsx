import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import FlowerDetail from "./pages/FlowerDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="app">
      <Navbar onOpenCart={() => setCartOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/flower/:id" element={<FlowerDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toast />
    </div>
  );
}
