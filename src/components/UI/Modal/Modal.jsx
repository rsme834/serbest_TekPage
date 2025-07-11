import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title,
  children, 
  size = 'medium',
  closable = true,
  className = '',
  ...props 
}) => {
  // إغلاق المودال عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closable]);

  if (!isOpen) return null;

  const modalClasses = [
    styles.modal,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closable) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={modalClasses} {...props}>
        {/* Header */}
        {(title || closable) && (
          <div className={styles.header}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {closable && (
              <button 
                className={styles.closeButton}
                onClick={onClose}
                type="button"
                aria-label="إغلاق"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;