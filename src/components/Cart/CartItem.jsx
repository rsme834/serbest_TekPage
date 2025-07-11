import React from 'react';
import Button from '../UI/Button';
import styles from './CartItem.module.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemImage}>
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <div className={styles.imagePlaceholder}>
            {item.type === 'service' ? '⚡' : '📦'}
          </div>
        )}
      </div>
      
      <div className={styles.itemInfo}>
        <h4 className={styles.itemName}>{item.name}</h4>
        <p className={styles.itemType}>
          {item.type === 'service' ? 'Service' : 'Product'}
        </p>
        <div className={styles.itemPrice}>
          {item.price} ₺ each
        </div>
      </div>
      
      <div className={styles.quantityControls}>
        <button
          className={styles.quantityBtn}
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className={styles.quantity}>{item.quantity}</span>
        <button
          className={styles.quantityBtn}
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          +
        </button>
      </div>
      
      <div className={styles.itemTotal}>
        <div className={styles.totalPrice}>{totalPrice} ₺</div>
        <Button
          variant="danger"
          size="small"
          onClick={handleRemove}
          className={styles.removeBtn}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};

export default CartItem;