import { NavLink } from 'react-router-dom';
import { useCart } from '../context/cart/useCart';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="text-2xl font-bold text-blue-600">
        MyStore
      </div>
      <div className="space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `relative inline-block px-2 py-1
            text-sm transition-colors duration-300
            ${isActive ? 'text-blue-600 font-semibold after:scale-100' : 'text-gray-700'}
            after:content-[''] after:block after:h-[2px] after:bg-blue-600
            after:transition-transform after:duration-300 after:scale-x-0
            hover:after:scale-x-100 after:origin-left`
          }
        >
          <div className="relative">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
        </NavLink>
      </div>
    </nav>
  );
}
