import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="bg-blue-100 py-20 text-center">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">Welcome to MyStore</h1>
        <p className="text-lg text-gray-700 mb-6">
          Find the best products with secure and fast payments
        </p>
        <NavLink
          to="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          See products
        </NavLink>
      </section>

      {/* Categories */}
      <section className="px-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Explore by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Clothes', icon: '👕' },
            { name: 'Electronics', icon: '💻' },
            { name: 'Games', icon: '🎮' },
            { name: 'Offers', icon: '🔥' },
          ].map((cat) => (
            <NavLink
              key={cat.name}
              to={`/products?category=${cat.name.toLowerCase()}`}
              className="border p-6 rounded shadow hover:shadow-lg transition text-center bg-white"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <span className="font-semibold text-gray-800">{cat.name}</span>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Trusted */}
      <section className="bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { title: 'Secure Payment', emoji: '🔒' },
            { title: 'Fast Shipping', emoji: '🚚' },
            { title: 'Easy Returns', emoji: '↩️' },
          ].map((item) => (
            <div key={item.title} className="bg-white p-6 rounded shadow">
              <div className="text-4xl mb-2">{item.emoji}</div>
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
