import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Styles
import './styles/variables.css';
import './styles/globals.css';
import './styles/responsive.css';

// Temporary Welcome Component
const Welcome = () => {
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ 
        background: 'var(--white)', 
        padding: '2rem', 
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'var(--primary-yellow)' }}>
          🎉 Payment App
        </h1>
        <p>المشروع جاهز للتطوير!</p>
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          background: 'var(--gradient-main)',
          borderRadius: 'var(--radius-md)',
          color: 'white'
        }}>
          <strong>✅ تم إعداد:</strong>
          <br />
          • React Router<br />
          • المتغيرات والألوان<br />
          • هيكل المجلدات<br />
          • Toast Notifications
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* Toast Notifications */}
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
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: 'var(--white)',
              },
            },
          }}
        />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/payer-info" element={<div>صفحة معلومات الدافع</div>} />
          <Route path="/cart" element={<div>صفحة السلة</div>} />
          <Route path="/payment-link" element={<div>صفحة رابط الدفع</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;