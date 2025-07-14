import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial State
const initialState = {
  items: [],
  subtotal: 0,
  fee: 0,
  total: 0,
  currency: 'TRY',
  merchantRef: '',
  invoiceId: '',
  availableProducts: [
    {
      id: 'PRODUCT-A',
      name: 'Product A',
      type: 'product',
      price: 100,
      image: null
    },
    {
      id: 'PRODUCT-B',
      name: 'Product B',
      type: 'product',
      price: 200,
      image: null
    },
    {
      id: 'SERVICE-C',
      name: 'Service C',
      type: 'service',
      price: 300,
      image: null
    },
    {
      id: 'PLAN-D',
      name: 'Plan D',
      type: 'service',
      price: 400,
      image: null
    }
  ]
};

// Action Types
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_MERCHANT_REF: 'SET_MERCHANT_REF',
  SET_INVOICE_ID: 'SET_INVOICE_ID',
  CALCULATE_TOTALS: 'CALCULATE_TOTALS',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  ADD_CUSTOM_PRODUCT: 'ADD_CUSTOM_PRODUCT'
};

// Helper function to generate IDs
const generateId = () => `PRODUCT-${Date.now()}`;
const generateMerchantRef = () => `ETC-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        newItems = [...state.items, { 
          ...action.payload, 
          quantity: action.payload.quantity || 1 
        }];
      }
      
      return { ...state, items: newItems };
    }
    
    case ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return { ...state, items: newItems };
    }
    
    case ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== id);
        return { ...state, items: newItems };
      }
      
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      return { ...state, items: newItems };
    }
    
    case ACTIONS.CLEAR_CART:
      return { ...state, items: [], subtotal: 0, fee: 0, total: 0 };
    
    case ACTIONS.SET_CURRENCY:
      return { ...state, currency: action.payload };
    
    case ACTIONS.SET_MERCHANT_REF:
      return { ...state, merchantRef: action.payload };
    
    case ACTIONS.SET_INVOICE_ID:
      return { ...state, invoiceId: action.payload };
    
    case ACTIONS.CALCULATE_TOTALS: {
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const fee = Math.round(subtotal * 0.05); // 5% fee
      const total = subtotal + fee;
      
      return { ...state, subtotal, fee, total };
    }
    
    case ACTIONS.LOAD_FROM_STORAGE:
      return { ...state, ...action.payload };
    
    case ACTIONS.ADD_CUSTOM_PRODUCT: {
      const customProduct = {
        ...action.payload,
        id: generateId()
      };
      const newItems = [...state.items, customProduct];
      return { ...state, items: newItems };
    }
    
    default:
      return state;
  }
};

// Context
const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialState,
    merchantRef: generateMerchantRef(),
    invoiceId: generateMerchantRef()
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('cartData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: ACTIONS.LOAD_FROM_STORAGE, payload: parsedData });
      } catch (error) {
        console.warn('Error loading cart data from storage:', error);
      }
    }
  }, []);

  // Save to localStorage and calculate totals whenever items change
  useEffect(() => {
    dispatch({ type: ACTIONS.CALCULATE_TOTALS });
    localStorage.setItem('cartData', JSON.stringify(state));
  }, [state.items, state.currency]);

  // Actions
  const addItem = (product, quantity = 1) => {
    dispatch({ 
      type: ACTIONS.ADD_ITEM, 
      payload: { ...product, quantity } 
    });
  };

  const removeItem = (id) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ 
      type: ACTIONS.UPDATE_QUANTITY, 
      payload: { id, quantity: parseInt(quantity) } 
    });
  };

  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
    localStorage.removeItem('cartData');
  };

  const setCurrency = (currency) => {
    dispatch({ type: ACTIONS.SET_CURRENCY, payload: currency });
  };

  const setMerchantRef = (ref) => {
    dispatch({ type: ACTIONS.SET_MERCHANT_REF, payload: ref });
  };

  const setInvoiceId = (id) => {
    dispatch({ type: ACTIONS.SET_INVOICE_ID, payload: id });
  };

  const generateNewMerchantRef = () => {
    const newRef = generateMerchantRef();
    setMerchantRef(newRef);
    return newRef;
  };

  const generateNewInvoiceId = () => {
    const newId = generateMerchantRef();
    setInvoiceId(newId);
    return newId;
  };

  const addCustomProduct = (productData) => {
    dispatch({ type: ACTIONS.ADD_CUSTOM_PRODUCT, payload: productData });
  };

  // Validation
  const isCartEmpty = () => state.items.length === 0;

  const getCartSummary = () => ({
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: state.subtotal,
    fee: state.fee,
    total: state.total,
    currency: state.currency
  });

  const value = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCurrency,
    setMerchantRef,
    setInvoiceId,
    generateNewMerchantRef,
    generateNewInvoiceId,
    addCustomProduct,
    isCartEmpty,
    getCartSummary
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;