# E-commerce Frontend with React

This is the React frontend of the e-commerce project integrated with **MercadoPago Brick SDK**. It provides a simple shopping experience and enables users to make secure payments using MercadoPago.

## 🚀 Features

- React app built with functional components and hooks
- Payment method selection (cash or MercadoPago)
- MercadoPago Brick integration via modal
- Dynamic payment preference creation
- User-friendly UI and responsive design

## 🛠️ Technologies

- React
- Vite
- JavaScript (ES6+)
- Tailwind CSS (if used)
- MercadoPago Brick SDK

## 📁 Project Structure

```
ecommerce-frontend-react/
├── public/
├── src/
│   ├── components/
│   │   ├── Checkout.jsx
│   │   ├── PaymentSelector.jsx
│   │   ├── MercadoPagoModal.jsx
│   │   └── ...
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── .env
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_PUBLIC_KEY=your_mercadopago_public_key
VITE_API_URL=http://localhost:4000
```

> Replace `your_mercadopago_public_key` with your MercadoPago public key. `VITE_API_URL` should point to your backend service.

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/borismora/ecommerce-frontend-react.git
cd ecommerce-frontend-react
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## 💳 Usage

1. Select a product and choose a payment method.
2. On selecting "MercadoPago", the app will call the backend to create a payment preference.
3. A modal will open with the MercadoPago payment interface (Brick).
4. Complete the payment using one of the available methods.

## 🔧 Customization

- You can modify the product data, payment logic, and modal appearance in the components under `src/components/`.
- The integration with the backend is done via `fetch` to `/create_preference`.

## ⚠️ Troubleshooting

- If the modal renders twice, ensure **React.StrictMode** is not causing double execution.
- Make sure your `.env` variables start with `VITE_` and that you restart the dev server after changes.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with 🛒 by [borismora](https://github.com/borismora)

