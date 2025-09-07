import products from '../data/products';
import { useCart } from '../context/cart/useCart';
import { useTranslation } from 'react-i18next';

export default function Products() {
  const { addToCart } = useCart();
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover rounded"
          />
          <h2 className="mt-4 text-lg font-semibold text-center">{product.name}</h2>
          <p className="text-gray-600 text-center text-2xl pb-3">${product.price.toLocaleString()}</p>
          <button
            onClick={() => addToCart(product)}
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {t('products.addToCart')}
          </button>
        </div>
      ))}
    </div>
  );
}
