import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Styles
import './styles/variables.css';
import './styles/globals.css';
import './styles/responsive.css';

// Import Contexts
import { PayerProvider } from './context/PayerContext';
import { CartProvider } from './context/CartContext';

// Import Pages
import PayerInfo from './pages/PayerInfo';
import CartManagement from './pages/CartManagement';
import PaymentLink from './pages/PaymentLink';

function App() {
  return (
    <PayerProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--white)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--primary-yellow)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--success-green)',
                    secondary: 'var(--white)',
                  },
                },
              }}
            />

            <Routes>
              <Route path="/" element={<Navigate to="/payer-info" replace />} />
              <Route path="/payer-info" element={<PayerInfo />} />
              <Route path="/cart" element={<CartManagement />} />
              <Route path="/payment-link" element={<PaymentLink />} />
              <Route path="*" element={<Navigate to="/payer-info" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </PayerProvider>
  );
}

export default App;