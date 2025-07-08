import React from 'react';
import styles from './Card.module.css';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'medium',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  ...props 
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[padding],
    hoverable && styles.hoverable,
    clickable && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  const CardElement = clickable ? 'button' : 'div';

  return (
    <CardElement
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </CardElement>
  );
};

export default Card;