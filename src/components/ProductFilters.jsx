import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';

export default function ProductFilters({ onSearch, onFilter }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', brand: '' });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadBrands();
  }, [filters.category]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    let newFilters = {
      ...filters,
      [name]: value
    };

    if (name === "category") {
      newFilters.brand = "";
    }

    setFilters(newFilters);
    onFilter(newFilters);
  };

  const loadCategories = async () => {
    try {
      const data = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const loadBrands = async () => {
    try {
      const data = await api.get(`/brands?category=${filters.category}`);
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white shadow-md rounded-lg mb-6">
      <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto items-center gap-2">
        <input
          type="text"
          placeholder={t('productFilters.placeholder')}
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded-lg px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {t('productFilters.search')}
        </button>
      </form>

      <div className="flex gap-3 flex-wrap">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">{t('productFilters.allCategories')}</option>
          {
            categories.map((cat) => (
              <option key={cat.name} value={cat.name}>{t(`productFilters.categories.${cat.name}`)}</option>
            ))
          }
        </select>

        <select
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">{t('productFilters.allBrands')}</option>
          {
            brands.map((brand) => (
              <option key={brand.name} value={brand.name}>{brand.name}</option>
            ))
          }
        </select>
      </div>
    </div>
  );
}
