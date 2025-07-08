import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial State
const initialState = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  },
  billingAddress: {
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'TR'
  },
  shippingAddress: {
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'TR'
  },
  sameAsShipping: true,
  isValid: false,
  errors: {}
};

// Action Types
const ACTIONS = {
  UPDATE_PERSONAL_INFO: 'UPDATE_PERSONAL_INFO',
  UPDATE_BILLING_ADDRESS: 'UPDATE_BILLING_ADDRESS',
  UPDATE_SHIPPING_ADDRESS: 'UPDATE_SHIPPING_ADDRESS',
  TOGGLE_SAME_AS_SHIPPING: 'TOGGLE_SAME_AS_SHIPPING',
  SET_ERRORS: 'SET_ERRORS',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  RESET_FORM: 'RESET_FORM',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE'
};

// Reducer
const payerReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_PERSONAL_INFO:
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload }
      };
    
    case ACTIONS.UPDATE_BILLING_ADDRESS:
      return {
        ...state,
        billingAddress: { ...state.billingAddress, ...action.payload }
      };
    
    case ACTIONS.UPDATE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: { ...state.shippingAddress, ...action.payload }
      };
    
    case ACTIONS.TOGGLE_SAME_AS_SHIPPING:
      return {
        ...state,
        sameAsShipping: action.payload,
        shippingAddress: action.payload ? state.billingAddress : state.shippingAddress
      };
    
    case ACTIONS.SET_ERRORS:
      return {
        ...state,
        errors: { ...state.errors, ...action.payload }
      };
    
    case ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        errors: {}
      };
    
    case ACTIONS.RESET_FORM:
      return initialState;
    
    case ACTIONS.LOAD_FROM_STORAGE:
      return {
        ...state,
        ...action.payload
      };
    
    default:
      return state;
  }
};

// Context
const PayerContext = createContext();

// Provider Component
export const PayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(payerReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('payerInfo');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: ACTIONS.LOAD_FROM_STORAGE, payload: parsedData });
      } catch (error) {
        console.warn('Error loading payer info from storage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('payerInfo', JSON.stringify(state));
  }, [state]);

  // Actions
  const updatePersonalInfo = (data) => {
    dispatch({ type: ACTIONS.UPDATE_PERSONAL_INFO, payload: data });
  };

  const updateBillingAddress = (data) => {
    dispatch({ type: ACTIONS.UPDATE_BILLING_ADDRESS, payload: data });
  };

  const updateShippingAddress = (data) => {
    dispatch({ type: ACTIONS.UPDATE_SHIPPING_ADDRESS, payload: data });
  };

  const toggleSameAsShipping = (value) => {
    dispatch({ type: ACTIONS.TOGGLE_SAME_AS_SHIPPING, payload: value });
  };

  const setErrors = (errors) => {
    dispatch({ type: ACTIONS.SET_ERRORS, payload: errors });
  };

  const clearErrors = () => {
    dispatch({ type: ACTIONS.CLEAR_ERRORS });
  };

  const resetForm = () => {
    dispatch({ type: ACTIONS.RESET_FORM });
    localStorage.removeItem('payerInfo');
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    
    // Personal Info Validation
    if (!state.personalInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!state.personalInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!state.personalInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(state.personalInfo.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!state.personalInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    // Billing Address Validation
    if (!state.billingAddress.line1.trim()) {
      errors.billingLine1 = 'Address is required';
    }
    
    if (!state.billingAddress.city.trim()) {
      errors.billingCity = 'City is required';
    }
    
    if (!state.billingAddress.state.trim()) {
      errors.billingState = 'State is required';
    }
    
    if (!state.billingAddress.postalCode.trim()) {
      errors.billingPostalCode = 'Postal code is required';
    }
    
    // Shipping Address Validation (if different)
    if (!state.sameAsShipping) {
      if (!state.shippingAddress.line1.trim()) {
        errors.shippingLine1 = 'Shipping address is required';
      }
      
      if (!state.shippingAddress.city.trim()) {
        errors.shippingCity = 'Shipping city is required';
      }
      
      if (!state.shippingAddress.state.trim()) {
        errors.shippingState = 'Shipping state is required';
      }
      
      if (!state.shippingAddress.postalCode.trim()) {
        errors.shippingPostalCode = 'Shipping postal code is required';
      }
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const value = {
    state,
    updatePersonalInfo,
    updateBillingAddress,
    updateShippingAddress,
    toggleSameAsShipping,
    setErrors,
    clearErrors,
    resetForm,
    validateForm,
    isValid: Object.keys(state.errors).length === 0
  };

  return (
    <PayerContext.Provider value={value}>
      {children}
    </PayerContext.Provider>
  );
};

// Custom Hook
export const usePayer = () => {
  const context = useContext(PayerContext);
  if (!context) {
    throw new Error('usePayer must be used within a PayerProvider');
  }
  return context;
};

export default PayerContext;