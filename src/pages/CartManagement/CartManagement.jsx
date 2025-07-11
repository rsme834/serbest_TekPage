import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

// Components
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
  const [isToggleCollapsed, setIsToggleCollapsed] = useState(false);
  const [customCurrency, setCustomCurrency] = useState(state.currency || 'TRY');

  const steps = [
    { title: 'Payer Information', subtitle: 'Personal details' },
    { title: 'Cart Management', subtitle: 'Products & pricing' },
    { title: 'Payment Link', subtitle: 'Create & share' }
  ];

  const handleAddToCart = (product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        background: '#f5d547',
        color: '#fff',
      },
    });
  };

  const handleRemoveFromCart = (id) => {
    removeItem(id);
    toast.success('Item removed from cart', {
      icon: '🗑️',
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    });
  };

  const handleQuantityUpdate = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  const handleAddCustomProduct = (productData) => {
    addCustomProduct(productData);
    toast.success(`${productData.name} added to cart!`, {
      icon: '✨',
      style: {
        background: '#10b981',
        color: '#fff',
      },
    });
  };

  const handleCreatePayment = async () => {
    if (isCartEmpty()) {
      toast.error('Your cart is empty. Please add at least one product.', {
        icon: '⚠️',
      });
      return;
    }

    setLoading(true);
    try {
      // Update currency before proceeding
      setCurrency(customCurrency);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Proceeding to payment link creation...', {
        icon: '🚀',
        style: {
          background: '#f5d547',
          color: '#fff',
        },
      });
      navigate('/payment-link');
    } catch (error) {
      toast.error('An error occurred. Please try again.', {
        icon: '❌',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/payer-info');
  };

  // Handle card click - add product to cart
  const handleCardClick = (product) => {
    handleAddToCart(product);
  };

  // Handle button click - prevent event bubbling and add to cart
  const handleButtonClick = (e, product) => {
    e.stopPropagation(); // Prevent card click event
    handleAddToCart(product);
  };

  const handleToggleCollapse = () => {
    setIsToggleCollapsed(!isToggleCollapsed);
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value.toUpperCase();
    setCustomCurrency(newCurrency);
  };

  const handleGenerateNewMerchantRef = () => {
    generateNewMerchantRef();
    toast.success('Merchant Reference updated!', {
      icon: '🔄',
    });
  };

  const handleGenerateNewInvoiceId = () => {
    generateNewInvoiceId();
    toast.success('Invoice ID updated!', {
      icon: '🔄',
    });
  };

  const cartSummary = getCartSummary();

  return (
    <div className={styles.cartPage}>
      {/* Progress Bar */}
      <ProgressBar steps={steps} currentStep={1} />
      
      {/* Available Products Section */}
      <div className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2>🛍️ Available Products</h2>
          <p>Select products and services to add to your cart</p>
        </div>
        
        <div className={styles.productsGrid}>
          {state.availableProducts.map(product => (
            <div 
              key={product.id} 
              className={`${styles.productCard} ${styles.fadeIn}`}
              onClick={() => handleCardClick(product)}
              title={`Click to add ${product.name} to cart`}
            >
              <div className={styles.productImage}>
                {product.emoji || '📦'}
              </div>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>
              <span className={styles.productWeight}>{product.weight || '100 gm'}</span>
              <div className={styles.productPrice}>₺{product.price}</div>
              <button
                onClick={(e) => handleButtonClick(e, product)}
                className={styles.productAddBtn}
                title={`Add ${product.name} to cart`}
              >
                +
              </button>
            </div>
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
      </div>
      
      {/* Main Layout - Cart & Summary Toggle */}
      <div className={styles.mainLayout}>
        {/* Shopping Cart Section */}
        <div className={styles.cartSection}>
          <div className={styles.cartHeader}>
            <h2 className={styles.cartTitle}>
              🛒 Shopping Cart ({cartSummary.itemCount} items)
            </h2>
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
        </div>

        {/* Order Summary Section - بدون toggle */}
        <div className={styles.summarySection}>
          <div className={styles.summaryHeader}>
            <h2 className={styles.summaryTitle}>Summary</h2>
          </div>
          
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>{cartSummary.subtotal} {customCurrency}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Processing Fee:</span>
              <span>{cartSummary.fee} {customCurrency}</span>
            </div>
            
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total:</span>
              <span>{cartSummary.total} {customCurrency}</span>
            </div>
          </div>
          
          {/* Settings - خانات ثابتة بدون scroll */}
          <div className={styles.additionalSettings}>
            <h3>⚙️ Settings</h3>
            
            <div className={styles.settingRow}>
              <label>Currency:</label>
              <input
                type="text"
                value={customCurrency}
                onChange={handleCurrencyChange}
                placeholder="Enter currency code (e.g., TRY)"
                className={styles.currencyInput}
                maxLength={3}
              />
            </div>
            
            <div className={styles.settingRow}>
              <label>Merchant Reference:</label>
              <div className={styles.settingInput}>
                <input
                  type="text"
                  value={state.merchantRef}
                  readOnly
                  className={styles.readOnlyInput}
                  title="Click refresh button to generate new reference"
                />
                <button
                  onClick={handleGenerateNewMerchantRef}
                  className={styles.refreshBtn}
                  title="Generate new Merchant Reference"
                >
                  🔄
                </button>
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
                  title="Click refresh button to generate new invoice ID"
                />
                <button
                  onClick={handleGenerateNewInvoiceId}
                  className={styles.refreshBtn}
                  title="Generate new Invoice ID"
                >
                  🔄
                </button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              onClick={handleCreatePayment}
              disabled={isCartEmpty() || loading}
              className={styles.createPaymentBtn}
            >
              {loading ? '🔄 Creating...' : ' Create Payment Link'}
            </button>
            
            <button
              onClick={handleBack}
              className={styles.backBtn}
            >
              ← Back to Payer Info
            </button>
          </div>
          
          {isCartEmpty() && (
            <div className={styles.emptyCartWarning}>
              <p>⚠️ Your cart is empty. Please add at least one product to continue.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddProduct={handleAddCustomProduct}
      />
    </div>
  );
};

export default CartManagement;