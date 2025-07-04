import { useCart } from '../context/cart/useCart';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty 🛒</h2>
        <Link to="/products" className="text-blue-600 hover:underline">
          Go back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border p-4 rounded"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">
                ${item.price.toLocaleString()} x {item.quantity}
              </p>
              <p className="text-sm text-gray-800 font-semibold">
                Subtotal: ${(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="text-right font-bold text-xl">
        Total: ${total.toLocaleString()}
      </div>

      <div className="text-right">
        <button
          onClick={clearCart}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
