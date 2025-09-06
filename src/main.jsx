import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/cart/CartProvider';
import { AuthProvider } from './context/auth/AuthProvider.jsx';
import { LanguageProvider } from './context/language/LanguageProvider.jsx';
import "./i18n";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter >
);
