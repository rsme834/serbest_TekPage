// API Base Configuration
const API_BASE_URL = 'https://api.paythor.com';
const PROGRAM_ID = 1;
const APP_ID = 102;

class PaymentAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('paythorAccessToken');
  }

  // Create payment link
  async createPaymentLink(paymentData) {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found. Please login first.');
    }

    const requestBody = {
      "payment": {
        "program_id": PROGRAM_ID,
        "app_id": APP_ID,
        "merchant_reference": paymentData.merchantRef,
        "invoice_id": paymentData.invoiceId,
        "currency": paymentData.currency,
        "amount": paymentData.amount,
        "payer": {
          "first_name": paymentData.payer.firstName,
          "last_name": paymentData.payer.lastName,
          "email": paymentData.payer.email,
          "phone": paymentData.payer.phone,
          "address": {
            "line_1": paymentData.payer.address.line1,
            "city": paymentData.payer.address.city,
            "state": paymentData.payer.address.state,
            "postal_code": paymentData.payer.address.postalCode,
            "country": paymentData.payer.address.country
          },
          "ip": await this.getUserIP()
        },
        "shipping": paymentData.shipping ? {
          "first_name": paymentData.shipping.firstName,
          "last_name": paymentData.shipping.lastName,
          "phone": paymentData.shipping.phone,
          "email": paymentData.shipping.email,
          "address": {
            "line_1": paymentData.shipping.address.line1,
            "city": paymentData.shipping.address.city,
            "state": paymentData.shipping.address.state,
            "postal_code": paymentData.shipping.address.postalCode,
            "country": paymentData.shipping.address.country
          }
        } : null,
        "items": paymentData.items
      }
    };

    const response = await fetch(`${this.baseURL}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment link');
    }

    return await response.json();
  }

  // Get user IP address
  async getUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Could not get user IP:', error);
      return '127.0.0.1'; // fallback IP
    }
  }

  // Simulate payment link creation for development
  async createPaymentLinkMock(paymentData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock payment link
    const linkId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    return {
      success: true,
      data: {
        payment_link: `https://pay.paythor.com/payment/${linkId}`,
        payment_id: `PAY-${Date.now()}`,
        merchant_reference: paymentData.merchantRef,
        invoice_id: paymentData.invoiceId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'active',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        created_at: new Date().toISOString()
      }
    };
  }
}

export default new PaymentAPI();