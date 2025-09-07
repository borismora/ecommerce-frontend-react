import { useEffect, useRef } from 'react';
import { loadMercadoPagoSDK } from '../utils/loadMercadoPago';

export default function MercadoPagoModal({ preferenceId, user, amount, onClose, onSuccess }) {
  const modalRef = useRef(null);

  useEffect(() => {
    let bricksBuilder;

    const initBrick = async () => {
      try {
        const MercadoPago = await loadMercadoPagoSDK();
        const mp = new MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
          locale: 'es',
        });
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        bricksBuilder = mp.bricks();

        const settings = {
          initialization: {
            amount,
            preferenceId,
            payer: {
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ')[1] || '',
              email: user.email || '',
            },
          },
          customization: {
            visual: {
              style: { theme: 'default' },
            },
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
              ticket: 'all',
              bankTransfer: 'all',
              atm: 'all',
              onboarding_credits: 'all',
              wallet_purchase: 'all',
              maxInstallments: 1,
            },
          },
          callbacks: {
            onReady: () => { },
            onSubmit: ({ formData }) =>
              new Promise((resolve, reject) => {
                fetch(`${apiUrl}/mercado-pago/process-payment`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    onSuccess?.(res);
                    resolve();
                  })
                  .catch((err) => {
                    console.error('Payment error:', err);
                    reject();
                  });
              }),
            onError: (error) => {
              console.error('Brick error:', error);
            },
          },
        };

        await bricksBuilder.create('payment', 'paymentBrick_container', settings);
      } catch (err) {
        console.error('Failed to load MercadoPago SDK:', err);
      }
    };

    initBrick();
  }, [preferenceId, user, amount, onSuccess]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" ref={modalRef}>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Completa tu pago</h2>
        <div id="paymentBrick_container" />
      </div>
    </div>
  );
}
