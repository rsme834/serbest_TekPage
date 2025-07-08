import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Import Styles
import './styles/variables.css';
import './styles/globals.css';
import './styles/responsive.css';

// Import Components
import Button from './components/UI/Button';
import Input from './components/UI/Input';
import Card from './components/UI/Card';

// Component Test Page
const ComponentTest = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    toast.success('Button clicked!');
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Card padding="large">
        <h1 style={{ color: 'var(--primary-yellow)', marginBottom: '2rem' }}>
          🧱 Component Testing
        </h1>
        
        {/* Button Tests */}
        <section style={{ marginBottom: '2rem' }}>
          <h3>Buttons:</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Button variant="primary" onClick={handleButtonClick} loading={loading}>
              Primary Button
            </Button>
            <Button variant="secondary">
              Secondary Button
            </Button>
            <Button variant="success" size="small">
              Success Small
            </Button>
            <Button variant="danger" disabled>
              Disabled Button
            </Button>
          </div>
        </section>

        {/* Input Tests */}
        <section style={{ marginBottom: '2rem' }}>
          <h3>Inputs:</h3>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem', maxWidth: '400px' }}>
            <Input
              label="Name"
              placeholder="Enter your name"
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              helper="We'll never share your email"
            />
            <Input
              label="Password"
              type="password"
              error="Password is too short"
            />
            <Input
              label="Disabled Input"
              disabled
              placeholder="This is disabled"
            />
          </div>
        </section>

        {/* Card Tests */}
        <section>
          <h3>Cards:</h3>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <Card hoverable>
              <h4>Hoverable Card</h4>
              <p>Hover over me!</p>
            </Card>
            <Card variant="highlighted" clickable onClick={() => toast.success('Card clicked!')}>
              <h4>Clickable Card</h4>
              <p>Click me!</p>
            </Card>
            <Card variant="success">
              <h4>Success Card</h4>
              <p>Success variant</p>
            </Card>
          </div>
        </section>
      </Card>
    </div>
  );
};

function App() {
  return (
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
          <Route path="/" element={<ComponentTest />} />
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