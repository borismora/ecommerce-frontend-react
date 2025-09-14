import { useAuth } from '../context/auth/useAuth';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">{t('profile.title')}</h2>
      {user ? (
        <div>
          <p className="mb-2"><strong>{t('profile.name')}:</strong> {user.name}</p>
          <p className="mb-2"><strong>{t('profile.email')}:</strong> {user.email}</p>
        </div>
      ) : (
        <p>{t('profile.user_not_logged_in')}</p>
      )}
    </div>
  );
};
