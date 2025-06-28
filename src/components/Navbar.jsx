import { NavLink } from 'react-router-dom';

export default function Navbar() {
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
                        isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }
                >
                    Cart
                </NavLink>
                <NavLink
                    to="/checkout"
                    className={({ isActive }) =>
                        isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }
                >
                    Checkout
                </NavLink>
            </div>
        </nav>
    );
}
