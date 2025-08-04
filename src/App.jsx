import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Navbar from './components/Navbar';
import OrderSummary from './pages/OrderSummary';
import Login from './pages/Login';
import Register from './pages/Register';
import { initMercadoPago } from '@mercadopago/sdk-react';

initMercadoPago('TEST-3b957cf9-8bcb-496f-a6c5-21468b00eae7');

function App() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-summary" element={<OrderSummary />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
