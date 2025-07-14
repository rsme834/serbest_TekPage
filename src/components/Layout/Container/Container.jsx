import React from 'react';
import styles from './Container.module.css';

const Container = ({ 
  children, 
  size = 'default',
  padding = 'default',
  centered = false,
  className = '',
  ...props 
}) => {
  const containerClasses = [
    styles.container,
    styles[size],
    styles[`padding-${padding}`],
    centered && styles.centered,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;