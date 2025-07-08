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
import Modal from './components/UI/Modal';
import ProgressBar from './components/Layout/ProgressBar';
import Container from './components/Layout/Container';

// Component Test Page
const ComponentTest = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { title: 'معلومات الدافع', subtitle: 'البيانات الشخصية' },
    { title: 'إدارة السلة', subtitle: 'المنتجات والأسعار' },
    { title: 'رابط الدفع', subtitle: 'إنشاء ومشاركة' }
  ];

  return (
    <Container>
      <Card padding="large">
        <h1 style={{ color: 'var(--primary-yellow)', marginBottom: '2rem' }}>
          🧩 Advanced Components Testing
        </h1>

        {/* Progress Bar Test */}
        <section style={{ marginBottom: '2rem' }}>
          <h3>Progress Bar:</h3>
          <ProgressBar steps={steps} currentStep={currentStep} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button 
              size="small" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              السابق
            </Button>
            <Button 
              size="small" 
              onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
              disabled={currentStep === 2}
            >
              التالي
            </Button>
          </div>
        </section>

        {/* Modal Test */}
        <section style={{ marginBottom: '2rem' }}>
          <h3>Modal:</h3>
          <Button onClick={() => setModalOpen(true)}>
            فتح Modal
          </Button>
          
          <Modal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)}
            title="إضافة منتج جديد"
            size="medium"
          >
            <div style={{ display: 'grid', gap: '1rem' }}>
              <Input 
                label="اسم المنتج" 
                placeholder="أدخل اسم المنتج"
                required
              />
              <Input 
                label="السعر" 
                type="number" 
                placeholder="0.00"
                required
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => {
                  toast.success('تم إضافة المنتج!');
                  setModalOpen(false);
                }}>
                  إضافة
                </Button>
              </div>
            </div>
          </Modal>
        </section>

        {/* Container Test */}
        <section>
          <h3>Container Variants:</h3>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            <Card variant="highlighted">
              <h4>Container Default</h4>
              <p>Max-width: 1200px with responsive padding</p>
            </Card>
          </div>
        </section>

        {/* Previous Components */}
        <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--medium-gray)' }}>
          <h3>Previous Components:</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
          </div>
        </section>
      </Card>
    </Container>
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