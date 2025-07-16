import { useCart } from '../context/cart/useCart';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { submitOrder } from '../services/orders';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { form, error, validate, handleChange } = useCheckoutForm();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await submitOrder({
        user: form,
        items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        total,
      });

      localStorage.setItem('lastOrder', JSON.stringify({
        user: form,
        items: cart,
        total,
      }));

      clearCart();
      navigate('/order-summary', {
        state: { order: { user: form, items: cart, total } },
      });
    } catch (error) {
      console.log('Order failed:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'address'].map((field) => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          ))}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="text-right font-semibold">
            Total: ${total.toLocaleString()}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </form>
      )}
    </div>
  );
}
