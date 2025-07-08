import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

// Components
import Container from '../../components/Layout/Container';
import ProgressBar from '../../components/Layout/ProgressBar';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { ProductCard, CartItem, AddProductModal } from '../../components/Cart';

import styles from './CartManagement.module.css';

const CartManagement = () => {
  const navigate = useNavigate();
  const {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCurrency,
    generateNewMerchantRef,
    generateNewInvoiceId,
    addCustomProduct,
    isCartEmpty,
    getCartSummary
  } = useCart();

  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: 'Payer Information', subtitle: 'Personal details' },
    { title: 'Cart Management', subtitle: 'Products & pricing' },
    { title: 'Payment Link', subtitle: 'Create & share' }
  ];

  const handleAddToCart = (product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (id) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };

  const handleQuantityUpdate = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  const handleAddCustomProduct = (productData) => {
    addCustomProduct(productData);
    toast.success(`${productData.name} added to cart!`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleCreatePayment = async () => {
    if (isCartEmpty()) {
      toast.error('Your cart is empty. Please add at least one product.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Proceeding to payment link creation...');
      navigate('/payment-link');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cartSummary = getCartSummary();

  return (
    <Container>
      <div className={styles.cartPage}>
        {/* Progress Bar */}
        <ProgressBar steps={steps} currentStep={1} />
        
        {/* Main Content */}
        <div className={styles.cartLayout}>
          {/* Left Panel - Products */}
          <div className={styles.leftPanel}>
            <Card padding="large">
              <div className={styles.sectionHeader}>
                <h2>🛍️ Available Products</h2>
                <p>Select products and services to add to your cart</p>
              </div>
              
              <div className={styles.productsGrid}>
                {state.availableProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              
              <div className={styles.customProductSection}>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(true)}
                  className={styles.addCustomBtn}
                >
                  ➕ Add Custom Product
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Panel - Cart & Summary */}
          <div className={styles.rightPanel}>
            {/* Cart Items */}
            <Card padding="large" className={styles.cartSection}>
              <div className={styles.sectionHeader}>
                <h2>🛒 Shopping Cart ({cartSummary.itemCount} items)</h2>
                {!isCartEmpty() && (
                  <Button
                    variant="danger"
                    size="small"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Button>
                )}
              </div>
              
              {isCartEmpty() ? (
                <div className={styles.emptyCart}>
                  <div className={styles.emptyCartIcon}>🛒</div>
                  <h3>Your cart is empty</h3>
                  <p>Add some products to get started</p>
                </div>
              ) : (
                <div className={styles.cartItems}>
                  {state.items.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleQuantityUpdate}
                      onRemove={handleRemoveFromCart}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Order Summary */}
            <Card padding="large" className={styles.summarySection}>
              <div className={styles.sectionHeader}>
                <h2>💰 Order Summary</h2>
              </div>
              
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>{cartSummary.subtotal} ₺</span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span>Processing Fee:</span>
                  <span>{cartSummary.fee} ₺</span>
                </div>
                
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total:</span>
                  <span>{cartSummary.total} ₺</span>
                </div>
              </div>
              
              {/* Additional Settings */}
              <div className={styles.additionalSettings}>
                <h3>Additional Settings</h3>
                
                <div className={styles.settingRow}>
                  <label>Currency:</label>
                  <select
                    value={state.currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={styles.settingSelect}
                  >
                    <option value="TRY">🇹🇷 Turkish Lira (₺)</option>
                    <option value="USD">🇺🇸 US Dollar ($)</option>
                    <option value="EUR">🇪🇺 Euro (€)</option>
                  </select>
                </div>
                
                <div className={styles.settingRow}>
                  <label>Merchant Reference:</label>
                  <div className={styles.settingInput}>
                    <input
                      type="text"
                      value={state.merchantRef}
                      readOnly
                      className={styles.readOnlyInput}
                    />
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={generateNewMerchantRef}
                    >
                      🔄
                    </Button>
                  </div>
                </div>
                
                <div className={styles.settingRow}>
                  <label>Invoice ID:</label>
                  <div className={styles.settingInput}>
                    <input
                      type="text"
                      value={state.invoiceId}
                      readOnly
                      className={styles.readOnlyInput}
                    />
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={generateNewInvoiceId}
                    >
                      🔄
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/payer-info')}
                >
                  ← Back
                </Button>
                
                <Button
                  size="large"
                  onClick={handleCreatePayment}
                  loading={loading}
                  disabled={isCartEmpty()}
                >
                  Create Payment Link →
                </Button>
              </div>
              
              {isCartEmpty() && (
                <div className={styles.emptyCartWarning}>
                  <p>⚠️ Your cart is empty. Please add at least one product to continue.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
        
        {/* Add Product Modal */}
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddProduct={handleAddCustomProduct}
        />
      </div>
    </Container>
  );
};

export default CartManagement;