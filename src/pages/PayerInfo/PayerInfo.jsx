import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePayer } from '../../context/PayerContext';

// Components
import Container from '../../components/Layout/Container';
import ProgressBar from '../../components/Layout/ProgressBar';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

import styles from './PayerInfo.module.css';

const PayerInfo = () => {
  const navigate = useNavigate();
  const { 
    state, 
    updatePersonalInfo, 
    updateBillingAddress, 
    updateShippingAddress,
    toggleSameAsShipping,
    validateForm,
    clearErrors
  } = usePayer();

  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false); // للتحكم في Toggle Animation

  const steps = [
    { title: 'Payer Information', subtitle: 'Personal details' },
    { title: 'Cart Management', subtitle: 'Products & pricing' },
    { title: 'Payment Link', subtitle: 'Create & share' }
  ];

  // Handle form submission with animation
  // فقط استبدال دالة handleSubmit في الكود الأصلي

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  clearErrors();

  try {
    const isValid = validateForm();
    
    if (isValid) {
      setIsActive(true); 
      
      toast.success('Information saved successfully!');
      
      setTimeout(() => {
        navigate('/cart');
      }, 1500); 
    } else {
      toast.error('Please correct the errors mentioned');
      setLoading(false);
    }
  } catch (error) {
    toast.error('An error occurred, please try again');
    setLoading(false);
  }
};
  const handlePersonalInfoChange = (field) => (e) => {
    updatePersonalInfo({ [field]: e.target.value });
  };

  const handleBillingAddressChange = (field) => (e) => {
    updateBillingAddress({ [field]: e.target.value });
  };

  const handleShippingAddressChange = (field) => (e) => {
    updateShippingAddress({ [field]: e.target.value });
  };

  const handleSameAsShippingChange = (e) => {
    toggleSameAsShipping(e.target.checked);
  };

  // Reset animation for back button
  const handleBack = () => {
    setIsActive(false);
    navigate('/');
  };

  return (
    <div className={styles.payerInfoPage}>
      {/* Progress Bar */}
      <Container>
        <ProgressBar steps={steps} currentStep={0} />
      </Container>
      
      {/* Main Container with Toggle Animation */}
      <div className={`${styles.mainContainer} ${isActive ? styles.active : ''}`}>
        
        {/* Form Section */}
        <div className={`${styles.formContainer} ${styles.payerForm}`}>
          <Card padding="large" className={styles.formCard}>
            

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Personal Information Section */}
              <section className={styles.section}>
                <h2>Personal Information</h2>
                <div className={styles.formGrid}>
                  <Input
                    label="First Name"
                    placeholder="John"
                    required
                    value={state.personalInfo.firstName}
                    onChange={handlePersonalInfoChange('firstName')}
                    error={state.errors.firstName}
                  />
                  
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    required
                    value={state.personalInfo.lastName}
                    onChange={handlePersonalInfoChange('lastName')}
                    error={state.errors.lastName}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={state.personalInfo.email}
                    onChange={handlePersonalInfoChange('email')}
                    error={state.errors.email}
                  />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+90 XXX XXX XX XX"
                    required
                    value={state.personalInfo.phone}
                    onChange={handlePersonalInfoChange('phone')}
                    error={state.errors.phone}
                  />
                </div>
              </section>

              {/* Billing Address Section */}
              <section className={styles.section}>
                <h2>🏠 Billing Address</h2>
                <div className={styles.formGrid}>
                  <Input
                    label="Street Address"
                    placeholder="Street, building number, district"
                    required
                    value={state.billingAddress.line1}
                    onChange={handleBillingAddressChange('line1')}
                    error={state.errors.billingLine1}
                    className={styles.fullWidth}
                  />
                  
                  <Input
                    label="City"
                    placeholder="Antalya"
                    required
                    value={state.billingAddress.city}
                    onChange={handleBillingAddressChange('city')}
                    error={state.errors.billingCity}
                  />
                  
                  <Input
                    label="State/Province"
                    placeholder="Konyaalti"
                    required
                    value={state.billingAddress.state}
                    onChange={handleBillingAddressChange('state')}
                    error={state.errors.billingState}
                  />
                  
                  <Input
                    label="Postal Code"
                    placeholder="07000"
                    required
                    value={state.billingAddress.postalCode}
                    onChange={handleBillingAddressChange('postalCode')}
                    error={state.errors.billingPostalCode}
                  />
                  
                  <Input
                    label="Country Code"
                    placeholder="TR"
                    required
                    value={state.billingAddress.country}
                    onChange={handleBillingAddressChange('country')}
                    error={state.errors.billingCountry}
                    maxLength="2"
                  />
                </div>
              </section>

              {/* Shipping Address Toggle */}
              <section className={styles.section}>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={state.sameAsShipping}
                    onChange={handleSameAsShippingChange}
                    className={styles.checkbox}
                  />
                  <label htmlFor="sameAsShipping" className={styles.checkboxLabel}>
                    Shipping address is the same as billing address
                  </label>
                </div>
              </section>

              {/* Shipping Address Section (if different) */}
              {!state.sameAsShipping && (
                <section className={styles.section}>
                  <h2>📦 Shipping Address</h2>
                  <div className={styles.formGrid}>
                    <Input
                      label="Street Address"
                      placeholder="Shipping address"
                      required
                      value={state.shippingAddress.line1}
                      onChange={handleShippingAddressChange('line1')}
                      error={state.errors.shippingLine1}
                      className={styles.fullWidth}
                    />
                    
                    <Input
                      label="City"
                      placeholder="City"
                      required
                      value={state.shippingAddress.city}
                      onChange={handleShippingAddressChange('city')}
                      error={state.errors.shippingCity}
                    />
                    
                    <Input
                      label="State/Province"
                      placeholder="State"
                      required
                      value={state.shippingAddress.state}
                      onChange={handleShippingAddressChange('state')}
                      error={state.errors.shippingState}
                    />
                    
                    <Input
                      label="Postal Code"
                      placeholder="Postal code"
                      required
                      value={state.shippingAddress.postalCode}
                      onChange={handleShippingAddressChange('postalCode')}
                      error={state.errors.shippingPostalCode}
                    />
                  </div>
                </section>
              )}

              {/* Form Actions - للشاشات الصغيرة فقط */}
              <div className={styles.formActionsMobile}>
                <Button
                  type="submit"
                  loading={loading}
                  size="large"
                  className={styles.submitButtonMobile}
                >
                  Next: Cart Management →
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Success Section */}
        
<div className={`${styles.formContainer} ${styles.payerSuccess}`}>
  <div className={styles.successContainer}>
    <h2>✨ Perfect!</h2>
    <div className={styles.successIcon}>
      <div className={styles.checkmark}>✓</div>
    </div>
    <p className={styles.successMessage}>
      Your information has been saved successfully!<br/>
      Let's continue to set up your cart!
    </p>
  </div>
</div>
        {/* Toggle Container */}
        <div className={styles.toggleContainer}>
          <div className={styles.toggle}>
            
            <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
              <h1>👤 Payer Information</h1>
              <p>Please fill in the following information<br/>
                 to create a payment link</p>
              <Button 
                type="submit"
                loading={loading}
                size="large"
                className={styles.submitButtonDesktop}
                onClick={handleSubmit}
              >
                Next: Cart Management →
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PayerInfo;