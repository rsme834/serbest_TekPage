import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({ 
  label,
  error,
  helper,
  icon,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const inputClasses = [
    styles.input,
    error && styles.error,
    icon && styles.withIcon,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    styles.container,
    disabled && styles.containerDisabled
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {icon && (
          <span className={styles.icon}>{icon}</span>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
      </div>
      
      {error && (
        <span className={styles.errorText}>{error}</span>
      )}
      
      {helper && !error && (
        <span className={styles.helperText}>{helper}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;