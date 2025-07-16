import { useLocation, Link } from 'react-router-dom';

export default function OrderSummary() {
  const { state } = useLocation();
  const order = state?.order || JSON.parse(localStorage.getItem('lastOrder'));

  if (!order) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Order Summary</h1>
        <p className="text-red-600">No order found. Please try again.</p>
        <Link to="/checkout" className="text-blue-600 underline">
          Go back to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className='max-w-xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Order Summary</h1>
      <p className='mb-2'><strong>Name: </strong>{order.user.name}</p>
      <p className='mb-2'><strong>Email: </strong>{order.user.email}</p>
      <p className='mb-2'><strong>Address: </strong>{order.user.address}</p>

      <h2 className='text-xl font-semibold mb-2'>Items:</h2>
      <ul className='space-y-2 mb-4'>
        {order.items.map((item) => (
          <li key={item.id} className='flex justify-between border-b pb-1'>
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <div className='text-right font-bold text-lg'>
        Total: ${order.total.toLocaleString()}
      </div>
    </div>
  )
}
