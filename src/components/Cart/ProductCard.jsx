import React from 'react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onAddToCart, disabled = false }) => {
  const handleAddClick = () => {
    onAddToCart(product);
  };

  return (
    <Card className={styles.productCard} hoverable>
      <div className={styles.productImage}>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className={styles.imagePlaceholder}>
            {product.type === 'service' ? '⚡' : '📦'}
          </div>
        )}
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productType}>
          {product.type === 'service' ? 'Service' : 'Product'}
        </p>
        <div className={styles.productPrice}>
          {product.price} ₺
        </div>
      </div>
      
      <div className={styles.productActions}>
        <Button
          size="small"
          onClick={handleAddClick}
          disabled={disabled}
          className={styles.addButton}
        >
          + Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;