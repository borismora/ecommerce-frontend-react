import { useTranslation } from 'react-i18next';

export default function Pagination({ page, totalPages, onPageChange }) {
  const { t } = useTranslation();

  const handlePrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50`}
      >
        {t('pagination.previous')}
      </button>

      <span className="text-gray-700">
        {t('pagination.page')} <strong>{page}</strong> {t('pagination.of')} <strong>{totalPages}</strong>
      </span>

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50`}
      >
        {t('pagination.next')}
      </button>
    </div>
  );
}
