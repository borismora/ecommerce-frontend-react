import { useState, useEffect } from 'react';
import { useCart } from '../context/cart/useCart';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { submitOrder } from '../services/orders';
import { createPreference } from '../services/payments/mercadoPago';
import { useNavigate } from 'react-router-dom';
import MercadoPagoModal from '../components/MercadoPagoModal';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { form, error, validate, handleChange } = useCheckoutForm();
  const [method, setMethod] = useState('cash');
  const [preferenceId, setPreferenceId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    setPreferenceId(null);
  }, [method])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const order = {
      user: form,
      items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      total,
    };

    try {
      await submitOrder(order);
      localStorage.setItem('lastOrder', JSON.stringify(order));

      if (method === 'cash') {
        clearCart();
        navigate('/order-summary', {
          state: { order: { ...order, method: 'Cash' } },
        });
      } else if (method === 'mp') {
        const prefId = await createPreference(cart);
        setPreferenceId(prefId);
        setShowModal(true);
      }
    } catch (error) {
      console.log('Order failed:', error);
    }
  };

  if (showModal && method === 'mp' && preferenceId) {
    return (
      <MercadoPagoModal
        preferenceId={preferenceId}
        user={form}
        amount={total}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          clearCart();
          navigate('/order-summary', {
            state: { order: { user: form, items: cart, total, method: 'MercadoPago' } },
          });
        }}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{t('checkout.title')}</h1>

      {cart.length === 0 ? (
        <p>{t('checkout.empty')}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'address'].map((field) => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              placeholder={t(`checkout.${field}`)}
              value={form[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          ))}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="text-right font-semibold">
            Total: ${total.toLocaleString()}
          </div>

          <div>
            <label><input type="radio" name="method" value="cash" checked={method === 'cash'} onChange={() => setMethod('cash')} /> {t('checkout.cash')}</label>
            <label className="ml-4"><input type="radio" name="method" value="mp" checked={method === 'mp'} onChange={() => setMethod('mp')} /> MercadoPago</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {t('checkout.submit')}
          </button>
        </form>
      )}
    </div>
  );
}
