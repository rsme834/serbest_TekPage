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

  const steps = [
    { title: 'Payer Information', subtitle: 'Personal details' },
    { title: 'Cart Management', subtitle: 'Products & pricing' },
    { title: 'Payment Link', subtitle: 'Create & share' }
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      const isValid = validateForm();
      
      if (isValid) {
        toast.success('Information saved successfully!');
        setTimeout(() => {
          navigate('/cart');
        }, 1000);
      } else {
        toast.error('Please correct the errors mentioned');
      }
    } catch (error) {
      toast.error('An error occurred, please try again');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
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

  return (
    <Container>
      <div className={styles.payerInfoPage}>
        {/* Progress Bar */}
        <ProgressBar steps={steps} currentStep={0} />
        
        {/* Main Content */}
        <Card padding="large" className={styles.formCard}>
          <div className={styles.header}>
            <h1>👤 Payer Information</h1>
            <p>Please fill in the following information to create a payment link</p>
          </div>

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
                
                <div className={styles.countrySelect}>
                  <label>Country</label>
                  <select 
                    value={state.billingAddress.country}
                    onChange={(e) => updateBillingAddress({ country: e.target.value })}
                  >
                    <option value="TR">🇹🇷 Turkey</option>
                    <option value="SA">🇸🇦 Saudi Arabia</option>
                    <option value="AE">🇦🇪 UAE</option>
                    <option value="EG">🇪🇬 Egypt</option>
                  </select>
                </div>
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

            {/* Form Actions */}
            <div className={styles.formActions}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate('/')}
              >
                Back
              </Button>
              
              <Button
                type="submit"
                loading={loading}
                size="large"
              >
                Next: Cart Management →
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
};

export default PayerInfo;