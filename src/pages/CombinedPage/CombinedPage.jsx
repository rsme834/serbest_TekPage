

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { usePayer } from '../../context/PayerContext';

// Components
import ProgressBar from '../../components/Layout/ProgressBar';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { ProductCard, CartItem, AddProductModal } from '../../components/Cart';

import styles from './CombinedPage.module.css';



const CombinedPage = () => {
    const navigate = useNavigate();

    // Cart Context
    const {
        state: cartState,
        addItem,
        removeItem,
        updateQuantity,
        addCustomProduct,
        isCartEmpty,
        getCartSummary,
        setCurrency,
        generateNewMerchantRef,
        generateNewInvoiceId
    } = useCart();

    // Payer Context
    const {
        state: payerState,
        updatePersonalInfo,
        updateBillingAddress,
        updateShippingAddress,
        toggleSameAsShipping,
        validateForm,
        clearErrors
    } = usePayer();

    // Local States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPayerModal, setShowPayerModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customCurrency, setCustomCurrency] = useState(cartState.currency || 'TRY');
    const [payerInfoSaved, setPayerInfoSaved] = useState(false);

    const steps = [
        { title: 'Product Management', subtitle: 'Products & pricing' },
        { title: 'Payer Information', subtitle: 'Personal details' },
        { title: 'Payment Link', subtitle: 'Create & share' }
    ];

    // Product Handlers
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

    // Payer Info Handlers
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

    const handleSavePayerInfo = async () => {
        clearErrors();
        const isValid = validateForm();

        if (isValid) {
            setPayerInfoSaved(true);
            setShowPayerModal(false);
            toast.success('Information saved successfully!', {
                icon: '✅',
                style: {
                    background: '#10b981',
                    color: '#fff',
                },
            });
        } else {
            toast.error('Please correct the errors mentioned', {
                icon: '⚠️',
            });
        }
    };

    // Currency and Settings
    const handleCurrencyChange = (e) => {
        const newCurrency = e.target.value.toUpperCase();
        setCustomCurrency(newCurrency);
        setCurrency(newCurrency);
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

    // Create Payment Link
    const handleCreatePayment = async () => {
        if (isCartEmpty()) {
            toast.error('Your cart is empty. Please add at least one product.', {
                icon: '⚠️',
            });
            return;
        }

        if (!payerInfoSaved) {
            toast.error('Please enter payer information first.', {
                icon: '⚠️',
            });
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Creating payment link...', {
                icon: '',
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

    const cartSummary = getCartSummary();
    const canCreatePayment = !isCartEmpty() && payerInfoSaved;

    return (
        <div className={styles.combinedPage}>
            {/* Progress Bar */}
            <ProgressBar steps={steps} currentStep={payerInfoSaved ? 2 : 0} />

            <div className={styles.pageLayout}>
                {/* Left Column - Products & Cart */}
                <div className={styles.leftColumn}>
                    {/* Available Products Section */}
                    <div className={styles.productsSection}>
                        <div className={styles.sectionHeader}>
                            <h2> Available Products</h2>
                            <p>Select products and services to add to your cart</p>
                        </div>

                        <div className={styles.productsGrid}>
                            {cartState.availableProducts.map(product => (
                                <div
                                    key={product.id}
                                    className={`${styles.productCard} ${styles.fadeIn}`}
                                    onClick={() => handleAddToCart(product)}
                                    title={`Click to add ${product.name} to cart`}
                                >
                                    <div className={styles.productImage}>
                                        {product.emoji || '📦'}
                                    </div>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <p className={styles.productDescription}>{product.description || 'Premium quality product'}</p>
                                    <span className={styles.productWeight}>{product.weight || '100 gm'}</span>
                                    <div className={styles.productPrice}>₺{product.price}</div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
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
                                <span className={styles.addCustomIcon}>➕</span>
                                Add Custom Product
                            </Button>
                           
                        </div>
                    </div>







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
                                {cartState.items.map(item => (
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
                </div>

                {/* Right Column - Summary & Payer Info */}
                <div className={styles.rightColumn}>
                    {/* Order Summary */}
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
                    </div>

                    {/* Payer Information Section */}
                    <div className={styles.payerInfoSection}>
                        <div className={styles.payerInfoHeader}>
                            <h3>👤 Payer Information</h3>
                            {payerInfoSaved && (
                                <div className={styles.savedIndicator}>
                                    <span className={styles.checkmark}>✓</span>
                                    <span>Saved</span>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="secondary"
                            onClick={() => setShowPayerModal(true)}
                            disabled={isCartEmpty()}
                            className={`${styles.payerInfoBtn} ${isCartEmpty() ? styles.disabled : ''}`}
                        >
                            {payerInfoSaved ? 'Edit Information' : 'Add Personal Information'}
                        </Button>

                        {isCartEmpty() && (
                            <p className={styles.addProductsFirst}>
                                Add products to cart first
                            </p>
                        )}
                    </div>

                    {/* Settings */}
                    <div className={styles.settingsSection}>
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
                                    value={cartState.merchantRef}
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
                                    value={cartState.invoiceId}
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

                    {/* Create Payment Button */}
                    <div className={styles.createPaymentSection}>
                        <button
                            onClick={handleCreatePayment}
                            disabled={!canCreatePayment || loading}
                            className={`${styles.createPaymentBtn} ${!canCreatePayment ? styles.disabled : ''}`}
                        >
                            {loading ? '🔄 Creating...' : ' Create Payment Link'}
                        </button>

                        {!canCreatePayment && (
                            <div className={styles.requirementsWarning}>
                                <p>⚠️ Requirements:</p>
                                <ul>
                                    <li className={isCartEmpty() ? styles.incomplete : styles.complete}>
                                        {isCartEmpty() ? '❌' : '✅'} Add at least one product
                                    </li>
                                    <li className={!payerInfoSaved ? styles.incomplete : styles.complete}>
                                        {!payerInfoSaved ? '❌' : '✅'} Enter payer information
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAddProduct={handleAddCustomProduct}
            />

            {/* Payer Information Modal */}
            {showPayerModal && (
                <div className={styles.modalOverlay} onClick={() => setShowPayerModal(false)}>
                    <div className={styles.payerModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>👤 Payer Information</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowPayerModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {/* Personal Information */}
                            <section className={styles.modalSection}>
                                <h3>Personal Information</h3>
                                <div className={styles.formGrid}>
                                    <Input
                                        label="First Name"
                                        placeholder="John"
                                        required
                                        value={payerState.personalInfo.firstName}
                                        onChange={handlePersonalInfoChange('firstName')}
                                        error={payerState.errors.firstName}
                                    />

                                    <Input
                                        label="Last Name"
                                        placeholder="Doe"
                                        required
                                        value={payerState.personalInfo.lastName}
                                        onChange={handlePersonalInfoChange('lastName')}
                                        error={payerState.errors.lastName}
                                    />

                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        value={payerState.personalInfo.email}
                                        onChange={handlePersonalInfoChange('email')}
                                        error={payerState.errors.email}
                                        className={styles.fullWidth}
                                    />

                                    <Input
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+90 XXX XXX XX XX"
                                        required
                                        value={payerState.personalInfo.phone}
                                        onChange={handlePersonalInfoChange('phone')}
                                        error={payerState.errors.phone}
                                        className={styles.fullWidth}
                                    />
                                </div>
                            </section>

                            {/* Billing Address */}
                            <section className={styles.modalSection}>
                                <h3>🏠 Billing Address</h3>
                                <div className={styles.formGrid}>
                                    <Input
                                        label="Street Address"
                                        placeholder="Street, building number, district"
                                        required
                                        value={payerState.billingAddress.line1}
                                        onChange={handleBillingAddressChange('line1')}
                                        error={payerState.errors.billingLine1}
                                        className={styles.fullWidth}
                                    />

                                    <Input
                                        label="City"
                                        placeholder="Antalya"
                                        required
                                        value={payerState.billingAddress.city}
                                        onChange={handleBillingAddressChange('city')}
                                        error={payerState.errors.billingCity}
                                    />

                                    <Input
                                        label="State/Province"
                                        placeholder="Konyaalti"
                                        required
                                        value={payerState.billingAddress.state}
                                        onChange={handleBillingAddressChange('state')}
                                        error={payerState.errors.billingState}
                                    />

                                    <Input
                                        label="Postal Code"
                                        placeholder="07000"
                                        required
                                        value={payerState.billingAddress.postalCode}
                                        onChange={handleBillingAddressChange('postalCode')}
                                        error={payerState.errors.billingPostalCode}
                                    />

                                    <Input
                                        label="Country Code"
                                        placeholder="TR"
                                        required
                                        value={payerState.billingAddress.country}
                                        onChange={handleBillingAddressChange('country')}
                                        error={payerState.errors.billingCountry}
                                        maxLength="2"
                                    />
                                </div>
                            </section>

                            {/* Shipping Address Toggle */}
                            <section className={styles.modalSection}>
                                <div className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        id="sameAsShipping"
                                        checked={payerState.sameAsShipping}
                                        onChange={handleSameAsShippingChange}
                                        className={styles.checkbox}
                                    />
                                    <label htmlFor="sameAsShipping" className={styles.checkboxLabel}>
                                        Shipping address is the same as billing address
                                    </label>
                                </div>
                            </section>

                            {/* Shipping Address (if different) */}
                            {!payerState.sameAsShipping && (
                                <section className={styles.modalSection}>
                                    <h3>📦 Shipping Address</h3>
                                    <div className={styles.formGrid}>
                                        <Input
                                            label="Street Address"
                                            placeholder="Shipping address"
                                            required
                                            value={payerState.shippingAddress.line1}
                                            onChange={handleShippingAddressChange('line1')}
                                            error={payerState.errors.shippingLine1}
                                            className={styles.fullWidth}
                                        />

                                        <Input
                                            label="City"
                                            placeholder="City"
                                            required
                                            value={payerState.shippingAddress.city}
                                            onChange={handleShippingAddressChange('city')}
                                            error={payerState.errors.shippingCity}
                                        />

                                        <Input
                                            label="State/Province"
                                            placeholder="State"
                                            required
                                            value={payerState.shippingAddress.state}
                                            onChange={handleShippingAddressChange('state')}
                                            error={payerState.errors.shippingState}
                                        />

                                        <Input
                                            label="Postal Code"
                                            placeholder="Postal code"
                                            required
                                            value={payerState.shippingAddress.postalCode}
                                            onChange={handleShippingAddressChange('postalCode')}
                                            error={payerState.errors.shippingPostalCode}
                                        />
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className={styles.modalActions}>
                            <Button
                                variant="secondary"
                                onClick={() => setShowPayerModal(false)}
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSavePayerInfo}
                                className={styles.saveBtn}
                            >
                                Save Information
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CombinedPage;
