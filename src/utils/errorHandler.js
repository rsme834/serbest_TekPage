// Error handling utilities
export class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

export const handleAPIError = (error) => {
  if (error instanceof APIError) {
    return {
      message: error.message,
      status: error.status,
      details: error.details
    };
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      message: 'Network error. Please check your internet connection.',
      status: 0,
      details: 'NETWORK_ERROR'
    };
  }
  
  return {
    message: error.message || 'An unexpected error occurred',
    status: error.status || 500,
    details: error.details || 'UNKNOWN_ERROR'
  };
};

export const logError = (error, context = '') => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};