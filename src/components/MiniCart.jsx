import { Link } from 'react-router-dom';
import { useCart } from '../context/cart/useCart';

export default function MiniCart() {
  const { cart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="absolute right-0 top-10 w-72 bg-white shadow-lg border rounded p-4 z-50">
      <h3 className='font-semibold mb-2'>Cart Preview</h3>

      {cart.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y text-sm max-h-40 overflow-y-auto">
            {cart.map((item) => (
              <li key={item.id} className='py-1 flex justify-between'>
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString('es-CL')}</span>
              </li>
            ))}
          </ul>

          <div className="mt-2 font-semibold text-right">
            Total: ${total.toLocaleString('es-CL')}
          </div>

          <Link
            to='/cart'
            className='mt-3 inline-block text-center w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition'
          >
            Go to Cart
          </Link>
        </>
      )}
    </div>
  )
}
