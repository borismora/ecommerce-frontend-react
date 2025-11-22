import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/products';
import { useCart } from '../context/cart/useCart';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Pagination from '../components/Pagination';
import ProductFilters from '../components/ProductFilters';

export default function Products() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get('category') || '';
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    category: categoryFromURL,
    brand: '',
    search: '',
  });

  const loadProducts = async () => {
    try {
      const data = await fetchProducts({
        page: pagination.page,
        category: filters.category,
        brand: filters.brand,
        search: filters.search,
      });
      setProducts(data.products);
      setPagination({ page: data.page, totalPages: data.totalPages });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (categoryFromURL && filters.category !== categoryFromURL) {
      setFilters((prev) => ({ ...prev, category: categoryFromURL }));
    }
  }, [categoryFromURL]);

  useEffect(() => {
    loadProducts();
  }, [pagination.page, filters]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearch = (term) => {
    const search = term.trim();
    setFilters((prev) => ({ ...prev, search: search || undefined }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilter = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-4">
      <ProductFilters onSearch={handleSearch} onFilter={handleFilter} />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
          >
            <img
              src={product.photo}
              alt={product.name}
              className="w-full h-80 rounded"
            />
            <h3 className="mt-4 font-bold text-center">{product.brand}</h3>
            <h2 className="text-lg font-semibold text-center">{product.name}</h2>
            <p className="text-gray-600 text-center text-2xl pb-3">
              ${product.price.toLocaleString()}
            </p>
            <button
              onClick={() => addToCart(product)}
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {t('products.addToCart')}
            </button>
          </div>
        ))}
      </div>

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
