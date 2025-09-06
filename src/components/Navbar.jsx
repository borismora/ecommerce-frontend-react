import { NavLink } from 'react-router-dom';
import { useCart } from '../context/cart/useCart';
import { ShoppingCart } from 'lucide-react';
import MiniCart from './MiniCart';
import { useState } from 'react';
import { useAuth } from '../context/auth/useAuth';
import { useLanguage } from '../context/language/useLanguage';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { cart } = useCart();
  const { user, performLogout } = useAuth();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="text-2xl font-bold text-blue-600">
        MyStore
      </div>
      <div className="space-x-4">
        <div className="inline-block mr-4">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="border border-gray-300 rounded-md p-1"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </div>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
          }
        >
          {t('navbar.home')}
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
          }
        >
          {t('navbar.products')}
        </NavLink>

        {user ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }
            >
              👋 {user.name}
            </NavLink>
            <button
              className="text-gray-700 underline hover:text-red-600 transition-colors cursor-pointer"
              onClick={performLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }
            >
              {t('navbar.login')}
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }
            >
              {t('navbar.register')}
            </NavLink>
          </>
        )}

        <div
          className="relative inline-block"
          onMouseEnter={() => setShowMiniCart(true)}
          onMouseLeave={() => setShowMiniCart(false)}
        >
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative inline-block ${isActive ? 'text-blue-600' : 'text-gray-700'}`
            }
          >
            <ShoppingCart size={28} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </NavLink>

          {showMiniCart && <MiniCart />}
        </div>
      </div>
    </nav>
  );
}
