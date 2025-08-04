import LoginForm from '../components/Auth/LoginForm';

export default function Login() {
  const handleLoginSuccess = (user) => {
    console.log('User logged in:', user);
  };

  return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
