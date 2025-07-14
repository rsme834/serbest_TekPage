import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePayer } from '../../context/PayerContext';
import { useCart } from '../../context/CartContext';

// Components
import Container from '../../components/Layout/Container';
import ProgressBar from '../../components/Layout/ProgressBar';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import QRCode from '../../components/UI/QRCode';

// Services
import PaymentAPI from '../../services/api';

import styles from './PaymentLink.module.css';

const PaymentLink = () => {
  const navigate = useNavigate();
  const { state: payerState } = usePayer();
  const { state: cartState, clearCart } = useCart();
  
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copying, setCopying] = useState(false);

  const steps = [
    { title: 'Payer Information', subtitle: 'Personal details' },
    { title: 'Cart Management', subtitle: 'Products & pricing' },
    { title: 'Payment Link', subtitle: 'Create & share' }
  ];

  useEffect(() => {
    createPaymentLink();
  }, []);

  const createPaymentLink = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare payment data
      const paymentRequestData = {
        merchantRef: cartState.merchantRef,
        invoiceId: cartState.invoiceId,
        currency: cartState.currency,
        amount: cartState.total,
        payer: {
          firstName: payerState.personalInfo.firstName,
          lastName: payerState.personalInfo.lastName,
          email: payerState.personalInfo.email,
          phone: payerState.personalInfo.phone,
          address: {
            line1: payerState.billingAddress.line1,
            city: payerState.billingAddress.city,
            state: payerState.billingAddress.state,
            postalCode: payerState.billingAddress.postalCode,
            country: payerState.billingAddress.country
          }
        },
        shipping: !payerState.sameAsShipping ? {
          firstName: payerState.shippingAddress.firstName || payerState.personalInfo.firstName,
          lastName: payerState.shippingAddress.lastName || payerState.personalInfo.lastName,
          phone: payerState.shippingAddress.phone || payerState.personalInfo.phone,
          email: payerState.shippingAddress.email || payerState.personalInfo.email,
          address: {
            line1: payerState.shippingAddress.line1,
            city: payerState.shippingAddress.city,
            state: payerState.shippingAddress.state,
            postalCode: payerState.shippingAddress.postalCode,
            country: payerState.shippingAddress.country
          }
        } : null,
        items: cartState.items
      };

      // Use mock API for development - replace with real API call
      const response = await PaymentAPI.createPaymentLinkMock(paymentRequestData);
      
      if (response.success) {
        setPaymentData(response.data);
        toast.success('Payment link created successfully!', {
          icon: '🎉',
          style: {
            background: '#f5d547',
            color: '#fff',
          },
        });
      } else {
        throw new Error('Failed to create payment link');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create payment link', {
        icon: '❌',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!paymentData?.payment_link) return;
    
    setCopying(true);
    try {
      await navigator.clipboard.writeText(paymentData.payment_link);
      toast.success('Payment link copied to clipboard!', {
        icon: '📋',
        style: {
          background: '#f5d547',
          color: '#fff',
        },
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = paymentData.payment_link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Payment link copied to clipboard!', {
        icon: '📋',
        style: {
          background: '#f5d547',
          color: '#fff',
        },
      });
    } finally {
      setCopying(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!paymentData?.payment_link) return;
    
    const message = `💳 Payment Link: ${paymentData.payment_link}\n💰 Amount: ${paymentData.amount} ${paymentData.currency}\n📄 Reference: ${paymentData.merchant_reference}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailShare = () => {
    if (!paymentData?.payment_link) return;
    
    const subject = encodeURIComponent('Payment Link - Payment Required');
    const body = encodeURIComponent(
      `Dear Customer,\n\nPlease use the following link to complete your payment:\n\n${paymentData.payment_link}\n\nPayment Details:\nAmount: ${paymentData.amount} ${paymentData.currency}\nReference: ${paymentData.merchant_reference}\nInvoice ID: ${paymentData.invoice_id}\n\nThank you for your business!\n\nBest regards`
    );
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  const handleNewPayment = () => {
    if (window.confirm('Are you sure you want to create a new payment? This will clear the current cart.')) {
      clearCart();
      // الانتقال إلى صفحة Cart Management بدلاً من Payer Information
      navigate('/cart');
      toast.success('Starting new payment process', {
        icon: '🔄',
        style: {
          background: '#f5d547',
          color: '#fff',
        },
      });
    }
  };

  const getOrderSummary = () => {
    return {
      itemCount: cartState.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cartState.subtotal,
      fee: cartState.fee,
      total: cartState.total,
      currency: cartState.currency
    };
  };

  if (loading) {
    return (
      <Container>
        <div className={styles.loadingContainer}>
          <Card padding="large" className={styles.loadingCard}>
            <div className={styles.loadingContent}>
              {/* عودة إلى علامة التحميل الأصلية */}
              <div className={styles.spinner}></div>
              <h2>Creating Payment Link...</h2>
              <p>Please wait while we process your request</p>
            </div>
          </Card>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className={styles.errorContainer}>
          <Card padding="large" className={styles.errorCard}>
            <div className={styles.errorContent}>
              <div className={styles.errorIcon}>❌</div>
              <h2>Error Creating Payment Link</h2>
              <p>{error}</p>
              <div className={styles.errorActions}>
                <Button onClick={() => navigate('/cart')} variant="secondary">
                  ← Back to Cart
                </Button>
                <Button onClick={createPaymentLink}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    );
  }

  const orderSummary = getOrderSummary();

  return (
    <Container>
      <div className={styles.paymentLinkPage}>
        {/* Progress Bar */}
        <ProgressBar steps={steps} currentStep={3} />
        
        {/* Success Content */}
        <Card padding="large" className={styles.successCard}>
          <div className={styles.successHeader}>
            {/* دائرة النجاح مع علامة الصح */}
            <div className={styles.successIcon}>
              <div className={styles.checkmark}></div>
            </div>
            <h1>Payment Link Created Successfully!</h1>
            <p>Your payment link is ready to share</p>
          </div>

          <div className={styles.contentLayout}>
            {/* Payment Link Section */}
            <div className={styles.linkSection}>
              <h2>🔗 Your Payment Link</h2>
              
              <div className={styles.linkContainer}>
                <div className={styles.linkDisplay}>
                  <input
                    type="text"
                    value={paymentData?.payment_link || ''}
                    readOnly
                    className={styles.linkInput}
                  />
                  <button
                    onClick={handleCopyLink}
                    disabled={copying}
                    className={styles.copyButton}
                  >
                    {copying ? '🔄 Copying...' : '📋 Copy'}
                  </button>
                </div>
              </div>

              {/* Quick Summary */}
              <div className={styles.quickSummary}>
                <div className={styles.summaryItem}>
                  <span>💰 Total Amount:</span>
                  <strong>{paymentData?.amount} {paymentData?.currency}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>📦 Items:</span>
                  <strong>{orderSummary.itemCount}</strong>
                </div>
              </div>

              {/* Share Options - 3 أزرار فقط */}
              <div className={styles.shareSection}>
                <h3>📱 Share Payment Link</h3>
                <div className={styles.shareButtons}>
                  <button
                    onClick={handleWhatsAppShare}
                    className={`${styles.shareButton} ${styles.whatsapp}`}
                  >
                    <div className={styles.shareIcon}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.268 2 2 8.268 2 16c0 2.85.846 5.505 2.297 7.726L2 30l6.274-2.297C10.495 29.154 13.15 30 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm7.704 20.42c-.32.906-1.59 1.658-2.606 1.87-.701.146-1.615.264-4.69-.998-3.31-1.356-5.454-4.67-5.616-4.88-.162-.21-1.324-1.76-1.324-3.358 0-1.598.838-2.382 1.136-2.706.298-.324.65-.405.866-.405.216 0 .433.002.622.01.2.01.466-.076.728.555.27.65.918 2.24.998 2.404.08.162.134.352.028.568-.108.216-.162.352-.324.54-.162.19-.34.424-.486.57-.162.162-.33.338-.142.663.19.324.838 1.384 1.798 2.242 1.236 1.104 2.278 1.446 2.602 1.606.324.162.514.136.704-.082.19-.216.81-.946 1.026-1.27.216-.324.433-.27.73-.162.298.108 1.892.892 2.216 1.054.324.162.54.244.622.378.08.136.08.784-.242 1.69z" fill="#25D366"/>
                      </svg>
                    </div>
                    <div className={styles.shareText}>WhatsApp</div>
                  </button>
                  
                  <button
                    onClick={handleEmailShare}
                    className={`${styles.shareButton} ${styles.email}`}
                  >
                    <div className={styles.shareIcon}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M4 6h24a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M30 8L16 18L2 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className={styles.shareText}>Email</div>
                  </button>
                  
                  <button
                    onClick={() => setShowQRModal(true)}
                    className={`${styles.shareButton} ${styles.qr}`}
                  >
                    <div className={styles.shareIcon}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="3" y="3" width="10" height="10" stroke="#374151" strokeWidth="2" fill="none"/>
                        <rect x="19" y="3" width="10" height="10" stroke="#374151" strokeWidth="2" fill="none"/>
                        <rect x="3" y="19" width="10" height="10" stroke="#374151" strokeWidth="2" fill="none"/>
                        <rect x="5" y="5" width="6" height="6" fill="#374151"/>
                        <rect x="21" y="5" width="6" height="6" fill="#374151"/>
                        <rect x="5" y="21" width="6" height="6" fill="#374151"/>
                        <rect x="19" y="15" width="2" height="2" fill="#374151"/>
                        <rect x="23" y="15" width="2" height="2" fill="#374151"/>
                        <rect x="27" y="15" width="2" height="2" fill="#374151"/>
                        <rect x="19" y="19" width="2" height="2" fill="#374151"/>
                        <rect x="23" y="19" width="2" height="2" fill="#374151"/>
                        <rect x="27" y="19" width="2" height="2" fill="#374151"/>
                        <rect x="19" y="23" width="2" height="2" fill="#374151"/>
                        <rect x="23" y="23" width="2" height="2" fill="#374151"/>
                        <rect x="27" y="23" width="2" height="2" fill="#374151"/>
                        <rect x="19" y="27" width="2" height="2" fill="#374151"/>
                        <rect x="23" y="27" width="2" height="2" fill="#374151"/>
                        <rect x="27" y="27" width="2" height="2" fill="#374151"/>
                      </svg>
                    </div>
                    <div className={styles.shareText}>Show QR Code</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Button
              variant="secondary"
              onClick={() => setShowDetails(true)}
            >
              📊 View Details
            </Button>
            
            <button
              onClick={handleNewPayment}
              className={styles.newPaymentBtn}
            >
              🔄 Create New Payment
            </button>
          </div>
        </Card>

        {/* QR Code Modal */}
        <Modal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          title="QR Code"
          size="medium"
        >
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <QRCode
              value={paymentData?.payment_link || ''}
              size={200}
            />
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>
              Scan this QR code to open the payment link
            </p>
          </div>
        </Modal>

        {/* Details Modal */}
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title="Payment Details"
          size="large"
        >
          <div className={styles.detailsContent}>
            {/* Payer Information */}
            <section className={styles.detailSection}>
              <h3>👤 Payer Information</h3>
              <div className={styles.detailGrid}>
                <div>
                  <label>Name:</label>
                  <span>{payerState.personalInfo.firstName} {payerState.personalInfo.lastName}</span>
                </div>
                <div>
                  <label>Email:</label>
                  <span>{payerState.personalInfo.email}</span>
                </div>
                <div>
                  <label>Phone:</label>
                  <span>{payerState.personalInfo.phone}</span>
                </div>
                <div>
                  <label>Address:</label>
                  <span>{payerState.billingAddress.line1}, {payerState.billingAddress.city}</span>
                </div>
              </div>
            </section>

            {/* Order Items */}
            <section className={styles.detailSection}>
              <h3>📦 Order Items</h3>
              <div className={styles.itemsList}>
                {cartState.items.map(item => (
                  <div key={item.id} className={styles.detailItem}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQuantity}>× {item.quantity}</span>
                    <span className={styles.itemPrice}>{item.price * item.quantity} ₺</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Summary */}
            <section className={styles.detailSection}>
              <h3>💰 Payment Summary</h3>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>{orderSummary.subtotal} {paymentData?.currency}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Processing Fee:</span>
                  <span>{orderSummary.fee} {paymentData?.currency}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total:</span>
                  <span>{orderSummary.total} {paymentData?.currency}</span>
                </div>
              </div>
            </section>

            {/* Payment Reference */}
            <section className={styles.detailSection}>
              <h3>📄 Reference Information</h3>
              <div className={styles.referenceInfo}>
                <div>
                  <label>Payment ID:</label>
                  <span>{paymentData?.payment_id}</span>
                </div>
                <div>
                  <label>Merchant Reference:</label>
                  <span>{paymentData?.merchant_reference}</span>
                </div>
                <div>
                  <label>Invoice ID:</label>
                  <span>{paymentData?.invoice_id}</span>
                </div>
                <div>
                  <label>Created:</label>
                  <span>{new Date(paymentData?.created_at).toLocaleString()}</span>
                </div>
              </div>
            </section>
          </div>
        </Modal>
      </div>
    </Container>
  );
};

export default PaymentLink;